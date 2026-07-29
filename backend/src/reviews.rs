use async_trait::async_trait;
use axum::{
    extract::{Path, State},
    http::{header, HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    routing::get,
    Json, Router,
};
use base64::{engine::general_purpose::STANDARD as BASE64_STANDARD, Engine as _};
use chrono::{DateTime, Utc};
use sea_orm::{
    entity::prelude::*, ActiveModelTrait, DatabaseConnection, DbErr, EntityTrait, QueryOrder, Set,
};
use serde::{Deserialize, Serialize};
use std::{env, sync::Arc};

const MAX_AUTHOR_NAME_CHARS: usize = 80;
const MAX_REVIEW_TEXT_CHARS: usize = 1000;

pub(crate) mod entity {
    use sea_orm::entity::prelude::*;

    /// Модель отзыва в таблице `reviews`.
    #[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
    #[sea_orm(table_name = "reviews")]
    pub struct Model {
        #[sea_orm(primary_key)]
        pub id: i32,
        pub author_name: String,
        pub text: String,
        pub rating: i32,
        pub created_at: DateTimeUtc,
        pub updated_at: DateTimeUtc,
    }

    /// Связи отзывов с другими сущностями.
    #[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
    pub enum Relation {}

    impl ActiveModelBehavior for ActiveModel {}
}

#[derive(Clone)]
struct ReviewState {
    store: Arc<dyn ReviewRepository>,
    admin_credentials: AdminCredentials,
}

/// Учетные данные администратора для защищенных операций модерации.
#[derive(Clone, Debug, PartialEq, Eq)]
pub(crate) struct AdminCredentials {
    username: String,
    password: String,
}

impl AdminCredentials {
    /// Создает учетные данные администратора.
    ///
    /// # Параметры
    ///
    /// - `username` - имя администратора
    /// - `password` - пароль администратора
    ///
    /// # Возвращаемое значение
    ///
    /// Учетные данные для проверки Basic Auth
    pub(crate) fn new(username: impl Into<String>, password: impl Into<String>) -> Self {
        Self {
            username: username.into(),
            password: password.into(),
        }
    }

    /// Создает учетные данные администратора из переменных окружения.
    ///
    /// # Возвращаемое значение
    ///
    /// Учетные данные из `ADMIN_USERNAME` и `ADMIN_PASSWORD`
    pub(crate) fn from_env() -> Result<Self, String> {
        let username = env::var("ADMIN_USERNAME")
            .map_err(|_| "ADMIN_USERNAME должен быть задан для админки".to_owned())?;
        let password = env::var("ADMIN_PASSWORD")
            .map_err(|_| "ADMIN_PASSWORD должен быть задан для админки".to_owned())?;

        if username.trim().is_empty() || password.is_empty() {
            return Err("ADMIN_USERNAME и ADMIN_PASSWORD не должны быть пустыми".to_owned());
        }

        Ok(Self::new(username, password))
    }

    fn matches(&self, username: &str, password: &str) -> bool {
        secure_eq(&self.username, username) & secure_eq(&self.password, password)
    }
}

/// Отзыв, возвращаемый API и хранилищем.
#[derive(Clone, Debug, PartialEq, Eq)]
pub(crate) struct Review {
    pub id: i32,
    pub author_name: String,
    pub text: String,
    pub rating: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Данные для создания отзыва.
#[derive(Clone, Debug, PartialEq, Eq)]
pub(crate) struct NewReview {
    pub author_name: String,
    pub text: String,
    pub rating: i32,
}

/// Данные для частичного изменения отзыва.
#[derive(Clone, Debug, PartialEq, Eq)]
pub(crate) struct ReviewPatch {
    pub author_name: Option<String>,
    pub text: Option<String>,
    pub rating: Option<i32>,
}

#[derive(Debug)]
pub(crate) enum ReviewStoreError {
    Database(DbErr),
    NotFound,
}

impl From<DbErr> for ReviewStoreError {
    fn from(error: DbErr) -> Self {
        Self::Database(error)
    }
}

#[async_trait]
pub(crate) trait ReviewRepository: Send + Sync {
    async fn create(&self, new_review: NewReview) -> Result<Review, ReviewStoreError>;
    async fn list(&self) -> Result<Vec<Review>, ReviewStoreError>;
    async fn get(&self, id: i32) -> Result<Review, ReviewStoreError>;
    async fn update(&self, id: i32, patch: ReviewPatch) -> Result<Review, ReviewStoreError>;
    async fn delete(&self, id: i32) -> Result<(), ReviewStoreError>;
}

/// Хранилище отзывов на SeaORM и PostgreSQL.
pub(crate) struct SeaOrmReviewRepository {
    db: DatabaseConnection,
}

impl SeaOrmReviewRepository {
    /// Создает хранилище отзывов.
    ///
    /// # Параметры
    ///
    /// - `db` - подключение SeaORM к PostgreSQL
    ///
    /// # Возвращаемое значение
    ///
    /// Хранилище отзывов, использующее переданное подключение
    pub(crate) fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }
}

#[async_trait]
impl ReviewRepository for SeaOrmReviewRepository {
    async fn create(&self, new_review: NewReview) -> Result<Review, ReviewStoreError> {
        let now = Utc::now();
        let model = entity::ActiveModel {
            author_name: Set(new_review.author_name),
            text: Set(new_review.text),
            rating: Set(new_review.rating),
            created_at: Set(now),
            updated_at: Set(now),
            ..Default::default()
        }
        .insert(&self.db)
        .await?;

        Ok(model.into())
    }

    async fn list(&self) -> Result<Vec<Review>, ReviewStoreError> {
        let reviews = entity::Entity::find()
            .order_by_desc(entity::Column::CreatedAt)
            .all(&self.db)
            .await?
            .into_iter()
            .map(Review::from)
            .collect();

        Ok(reviews)
    }

    async fn get(&self, id: i32) -> Result<Review, ReviewStoreError> {
        entity::Entity::find_by_id(id)
            .one(&self.db)
            .await?
            .map(Review::from)
            .ok_or(ReviewStoreError::NotFound)
    }

    async fn update(&self, id: i32, patch: ReviewPatch) -> Result<Review, ReviewStoreError> {
        let model = entity::Entity::find_by_id(id)
            .one(&self.db)
            .await?
            .ok_or(ReviewStoreError::NotFound)?;
        let mut active_model: entity::ActiveModel = model.into();

        if let Some(author_name) = patch.author_name {
            active_model.author_name = Set(author_name);
        }

        if let Some(text) = patch.text {
            active_model.text = Set(text);
        }

        if let Some(rating) = patch.rating {
            active_model.rating = Set(rating);
        }

        active_model.updated_at = Set(Utc::now());

        Ok(active_model.update(&self.db).await?.into())
    }

    async fn delete(&self, id: i32) -> Result<(), ReviewStoreError> {
        let result = entity::Entity::delete_by_id(id).exec(&self.db).await?;

        if result.rows_affected == 0 {
            return Err(ReviewStoreError::NotFound);
        }

        Ok(())
    }
}

impl From<entity::Model> for Review {
    fn from(model: entity::Model) -> Self {
        Self {
            id: model.id,
            author_name: model.author_name,
            text: model.text,
            rating: model.rating,
            created_at: model.created_at,
            updated_at: model.updated_at,
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateReviewRequest {
    author_name: String,
    text: String,
    rating: i32,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateReviewRequest {
    author_name: Option<String>,
    text: Option<String>,
    rating: Option<i32>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ReviewResponse {
    id: i32,
    author_name: String,
    text: String,
    rating: i32,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct AdminSessionResponse {
    authenticated: bool,
}

impl From<Review> for ReviewResponse {
    fn from(review: Review) -> Self {
        Self {
            id: review.id,
            author_name: review.author_name,
            text: review.text,
            rating: review.rating,
            created_at: review.created_at,
            updated_at: review.updated_at,
        }
    }
}

#[derive(Serialize)]
struct ErrorResponse {
    error: &'static str,
    message: String,
}

#[derive(Debug)]
enum ApiError {
    Database(String),
    NotFound,
    Unauthorized,
    Validation(String),
}

impl From<ReviewStoreError> for ApiError {
    fn from(error: ReviewStoreError) -> Self {
        match error {
            ReviewStoreError::Database(error) => Self::Database(error.to_string()),
            ReviewStoreError::NotFound => Self::NotFound,
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        if matches!(self, Self::Unauthorized) {
            return (
                StatusCode::UNAUTHORIZED,
                [(
                    header::WWW_AUTHENTICATE,
                    r#"Basic realm="piloproject-admin", charset="UTF-8""#,
                )],
                Json(ErrorResponse {
                    error: "unauthorized",
                    message: "Неверный логин или пароль администратора".to_owned(),
                }),
            )
                .into_response();
        }

        let (status, error, message) = match self {
            Self::Database(message) => {
                eprintln!("database error while handling reviews API: {message}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "database_error",
                    "Не удалось обработать запрос".to_owned(),
                )
            }
            Self::NotFound => (
                StatusCode::NOT_FOUND,
                "review_not_found",
                "Отзыв не найден".to_owned(),
            ),
            Self::Validation(message) => (
                StatusCode::UNPROCESSABLE_ENTITY,
                "validation_error",
                message,
            ),
            Self::Unauthorized => unreachable!("unauthorized обрабатывается выше"),
        };

        (status, Json(ErrorResponse { error, message })).into_response()
    }
}

/// Создает маршруты API отзывов.
///
/// # Параметры
///
/// - `store` - хранилище отзывов
///
/// # Возвращаемое значение
///
/// Маршрутизатор Axum с CRUD-эндпоинтами отзывов
pub(crate) fn routes(
    store: Arc<dyn ReviewRepository>,
    admin_credentials: AdminCredentials,
) -> Router {
    Router::new()
        .route("/api/admin/session", get(admin_session))
        .route("/api/reviews", get(list_reviews).post(create_review))
        .route(
            "/api/reviews/:id",
            get(get_review).put(update_review).delete(delete_review),
        )
        .with_state(ReviewState {
            store,
            admin_credentials,
        })
}

async fn admin_session(
    State(state): State<ReviewState>,
    headers: HeaderMap,
) -> Result<Json<AdminSessionResponse>, ApiError> {
    require_admin(&headers, &state.admin_credentials)?;

    Ok(Json(AdminSessionResponse {
        authenticated: true,
    }))
}

async fn create_review(
    State(state): State<ReviewState>,
    Json(payload): Json<CreateReviewRequest>,
) -> Result<(StatusCode, Json<ReviewResponse>), ApiError> {
    let new_review = payload.into_new_review()?;
    let review = state.store.create(new_review).await?;

    Ok((StatusCode::CREATED, Json(review.into())))
}

async fn list_reviews(
    State(state): State<ReviewState>,
) -> Result<Json<Vec<ReviewResponse>>, ApiError> {
    let reviews = state
        .store
        .list()
        .await?
        .into_iter()
        .map(ReviewResponse::from)
        .collect();

    Ok(Json(reviews))
}

async fn get_review(
    State(state): State<ReviewState>,
    Path(id): Path<i32>,
) -> Result<Json<ReviewResponse>, ApiError> {
    let review = state.store.get(id).await?;

    Ok(Json(review.into()))
}

async fn update_review(
    State(state): State<ReviewState>,
    headers: HeaderMap,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateReviewRequest>,
) -> Result<Json<ReviewResponse>, ApiError> {
    require_admin(&headers, &state.admin_credentials)?;

    let patch = payload.into_patch()?;
    let review = state.store.update(id, patch).await?;

    Ok(Json(review.into()))
}

async fn delete_review(
    State(state): State<ReviewState>,
    headers: HeaderMap,
    Path(id): Path<i32>,
) -> Result<StatusCode, ApiError> {
    require_admin(&headers, &state.admin_credentials)?;

    state.store.delete(id).await?;

    Ok(StatusCode::NO_CONTENT)
}

impl CreateReviewRequest {
    fn into_new_review(self) -> Result<NewReview, ApiError> {
        Ok(NewReview {
            author_name: validate_text(self.author_name, "authorName", MAX_AUTHOR_NAME_CHARS)?,
            text: validate_text(self.text, "text", MAX_REVIEW_TEXT_CHARS)?,
            rating: validate_rating(self.rating)?,
        })
    }
}

impl UpdateReviewRequest {
    fn into_patch(self) -> Result<ReviewPatch, ApiError> {
        if self.author_name.is_none() && self.text.is_none() && self.rating.is_none() {
            return Err(ApiError::Validation(
                "Передайте хотя бы одно поле для изменения".to_owned(),
            ));
        }

        Ok(ReviewPatch {
            author_name: self
                .author_name
                .map(|value| validate_text(value, "authorName", MAX_AUTHOR_NAME_CHARS))
                .transpose()?,
            text: self
                .text
                .map(|value| validate_text(value, "text", MAX_REVIEW_TEXT_CHARS))
                .transpose()?,
            rating: self.rating.map(validate_rating).transpose()?,
        })
    }
}

fn validate_text(value: String, field: &'static str, max_chars: usize) -> Result<String, ApiError> {
    let value = value.trim().to_owned();

    if value.is_empty() {
        return Err(ApiError::Validation(format!(
            "Поле `{field}` не должно быть пустым"
        )));
    }

    if value.chars().count() > max_chars {
        return Err(ApiError::Validation(format!(
            "Поле `{field}` не должно быть длиннее {max_chars} символов"
        )));
    }

    Ok(value)
}

fn validate_rating(value: i32) -> Result<i32, ApiError> {
    if !(1..=5).contains(&value) {
        return Err(ApiError::Validation(
            "Поле `rating` должно быть числом от 1 до 5".to_owned(),
        ));
    }

    Ok(value)
}

fn require_admin(headers: &HeaderMap, credentials: &AdminCredentials) -> Result<(), ApiError> {
    let authorization = headers
        .get(header::AUTHORIZATION)
        .and_then(|value| value.to_str().ok())
        .ok_or(ApiError::Unauthorized)?;
    let encoded = authorization
        .strip_prefix("Basic ")
        .or_else(|| authorization.strip_prefix("basic "))
        .ok_or(ApiError::Unauthorized)?;
    let decoded = BASE64_STANDARD
        .decode(encoded)
        .map_err(|_| ApiError::Unauthorized)?;
    let decoded = String::from_utf8(decoded).map_err(|_| ApiError::Unauthorized)?;
    let (username, password) = decoded.split_once(':').ok_or(ApiError::Unauthorized)?;

    if !credentials.matches(username, password) {
        return Err(ApiError::Unauthorized);
    }

    Ok(())
}

fn secure_eq(left: &str, right: &str) -> bool {
    let left = left.as_bytes();
    let right = right.as_bytes();
    let max_len = left.len().max(right.len());
    let mut diff = left.len() ^ right.len();

    for index in 0..max_len {
        diff |= (left.get(index).copied().unwrap_or(0) as usize)
            ^ (right.get(index).copied().unwrap_or(0) as usize);
    }

    diff == 0
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::{
        body::{to_bytes, Body},
        http::Request,
    };
    use sea_orm::{DbBackend, MockDatabase, MockExecResult};
    use std::{
        collections::BTreeMap,
        sync::{
            atomic::{AtomicI32, Ordering},
            Arc,
        },
    };
    use tokio::sync::Mutex;
    use tower::ServiceExt;

    #[derive(Clone, Default)]
    struct MemoryReviewRepository {
        reviews: Arc<Mutex<BTreeMap<i32, Review>>>,
        next_id: Arc<AtomicI32>,
    }

    #[async_trait]
    impl ReviewRepository for MemoryReviewRepository {
        async fn create(&self, new_review: NewReview) -> Result<Review, ReviewStoreError> {
            let id = self.next_id.fetch_add(1, Ordering::SeqCst) + 1;
            let now = Utc::now();
            let review = Review {
                id,
                author_name: new_review.author_name,
                text: new_review.text,
                rating: new_review.rating,
                created_at: now,
                updated_at: now,
            };

            self.reviews.lock().await.insert(id, review.clone());

            Ok(review)
        }

        async fn list(&self) -> Result<Vec<Review>, ReviewStoreError> {
            let mut reviews = self
                .reviews
                .lock()
                .await
                .values()
                .cloned()
                .collect::<Vec<_>>();
            reviews.sort_by(|left, right| right.created_at.cmp(&left.created_at));

            Ok(reviews)
        }

        async fn get(&self, id: i32) -> Result<Review, ReviewStoreError> {
            self.reviews
                .lock()
                .await
                .get(&id)
                .cloned()
                .ok_or(ReviewStoreError::NotFound)
        }

        async fn update(&self, id: i32, patch: ReviewPatch) -> Result<Review, ReviewStoreError> {
            let mut reviews = self.reviews.lock().await;
            let review = reviews.get_mut(&id).ok_or(ReviewStoreError::NotFound)?;

            if let Some(author_name) = patch.author_name {
                review.author_name = author_name;
            }

            if let Some(text) = patch.text {
                review.text = text;
            }

            if let Some(rating) = patch.rating {
                review.rating = rating;
            }

            review.updated_at = Utc::now();

            Ok(review.clone())
        }

        async fn delete(&self, id: i32) -> Result<(), ReviewStoreError> {
            self.reviews
                .lock()
                .await
                .remove(&id)
                .map(|_| ())
                .ok_or(ReviewStoreError::NotFound)
        }
    }

    struct FailingReviewRepository;

    #[async_trait]
    impl ReviewRepository for FailingReviewRepository {
        async fn create(&self, _new_review: NewReview) -> Result<Review, ReviewStoreError> {
            Err(secret_database_error())
        }

        async fn list(&self) -> Result<Vec<Review>, ReviewStoreError> {
            Err(secret_database_error())
        }

        async fn get(&self, _id: i32) -> Result<Review, ReviewStoreError> {
            Err(secret_database_error())
        }

        async fn update(&self, _id: i32, _patch: ReviewPatch) -> Result<Review, ReviewStoreError> {
            Err(secret_database_error())
        }

        async fn delete(&self, _id: i32) -> Result<(), ReviewStoreError> {
            Err(secret_database_error())
        }
    }

    fn secret_database_error() -> ReviewStoreError {
        ReviewStoreError::Database(DbErr::Custom(
            "postgres://admin:super-secret@example.invalid/piloproject".to_owned(),
        ))
    }

    fn test_app(store: impl ReviewRepository + 'static) -> Router {
        routes(Arc::new(store), AdminCredentials::new("admin", "secret"))
    }

    fn admin_authorization() -> &'static str {
        "Basic YWRtaW46c2VjcmV0"
    }

    #[tokio::test]
    async fn admin_session_returns_authenticated() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/api/admin/session")
                    .header("authorization", admin_authorization())
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let body = response_json(response).await;
        assert_eq!(body["authenticated"], true);
    }

    #[tokio::test]
    async fn admin_session_rejects_missing_credentials() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/api/admin/session")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
        assert_eq!(
            response
                .headers()
                .get(header::WWW_AUTHENTICATE)
                .unwrap()
                .to_str()
                .unwrap(),
            r#"Basic realm="piloproject-admin", charset="UTF-8""#,
        );

        let body = response_json(response).await;
        assert_eq!(body["error"], "unauthorized");
    }

    #[tokio::test]
    async fn admin_session_rejects_wrong_credentials() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/api/admin/session")
                    .header("authorization", "Basic YWRtaW46YmFk")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    }

    async fn response_json(response: Response) -> serde_json::Value {
        let bytes = to_bytes(response.into_body(), usize::MAX).await.unwrap();
        serde_json::from_slice(&bytes).unwrap()
    }

    async fn create_review_for_test(app: Router) -> serde_json::Value {
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/reviews")
                    .header("content-type", "application/json")
                    .body(Body::from(
                        r#"{"authorName":"Анна","text":"Хороший брус и быстрая доставка","rating":5}"#,
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();

        response_json(response).await
    }

    fn review_model(id: i32, author_name: &str, text: &str, rating: i32) -> entity::Model {
        let now = Utc::now();

        entity::Model {
            id,
            author_name: author_name.to_owned(),
            text: text.to_owned(),
            rating,
            created_at: now,
            updated_at: now,
        }
    }

    fn assert_single_statement_contains(repo: SeaOrmReviewRepository, expected: &str) {
        let log = repo.db.into_transaction_log();

        assert_eq!(log.len(), 1);
        assert!(log[0].statements()[0].sql.contains(expected));
    }

    #[tokio::test]
    async fn create_review_returns_created_review() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/reviews")
                    .header("content-type", "application/json")
                    .body(Body::from(
                        r#"{"authorName":" Анна ","text":" Хороший брус ","rating":5}"#,
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::CREATED);

        let body = response_json(response).await;
        assert_eq!(body["id"], 1);
        assert_eq!(body["authorName"], "Анна");
        assert_eq!(body["text"], "Хороший брус");
        assert_eq!(body["rating"], 5);
    }

    #[tokio::test]
    async fn create_review_rejects_invalid_rating() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/reviews")
                    .header("content-type", "application/json")
                    .body(Body::from(
                        r#"{"authorName":"Анна","text":"Текст","rating":6}"#,
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);

        let body = response_json(response).await;
        assert_eq!(body["error"], "validation_error");
    }

    #[tokio::test]
    async fn create_review_rejects_empty_author_name() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/reviews")
                    .header("content-type", "application/json")
                    .body(Body::from(
                        r#"{"authorName":"   ","text":"Текст","rating":5}"#,
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);

        let body = response_json(response).await;
        assert_eq!(body["error"], "validation_error");
    }

    #[tokio::test]
    async fn create_review_rejects_empty_text() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/reviews")
                    .header("content-type", "application/json")
                    .body(Body::from(
                        r#"{"authorName":"Анна","text":"   ","rating":5}"#,
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);

        let body = response_json(response).await;
        assert_eq!(body["error"], "validation_error");
    }

    #[tokio::test]
    async fn create_review_rejects_too_long_author_name() {
        let app = test_app(MemoryReviewRepository::default());
        let body = serde_json::json!({
            "authorName": "a".repeat(MAX_AUTHOR_NAME_CHARS + 1),
            "text": "Текст",
            "rating": 5,
        });
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/reviews")
                    .header("content-type", "application/json")
                    .body(Body::from(body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);

        let body = response_json(response).await;
        assert_eq!(body["error"], "validation_error");
    }

    #[tokio::test]
    async fn create_review_rejects_too_long_text() {
        let app = test_app(MemoryReviewRepository::default());
        let body = serde_json::json!({
            "authorName": "Анна",
            "text": "a".repeat(MAX_REVIEW_TEXT_CHARS + 1),
            "rating": 5,
        });
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/reviews")
                    .header("content-type", "application/json")
                    .body(Body::from(body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);

        let body = response_json(response).await;
        assert_eq!(body["error"], "validation_error");
    }

    #[tokio::test]
    async fn list_reviews_returns_reviews() {
        let store = MemoryReviewRepository::default();
        let app = test_app(store);
        let _created = create_review_for_test(app.clone()).await;
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/api/reviews")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let body = response_json(response).await;
        assert_eq!(body.as_array().unwrap().len(), 1);
        assert_eq!(body[0]["authorName"], "Анна");
    }

    #[tokio::test]
    async fn database_errors_do_not_expose_internal_details() {
        let app = test_app(FailingReviewRepository);
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/api/reviews")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);

        let body = response_json(response).await;
        assert_eq!(body["error"], "database_error");
        assert_eq!(body["message"], "Не удалось обработать запрос");
    }

    #[tokio::test]
    async fn get_review_returns_review() {
        let store = MemoryReviewRepository::default();
        let app = test_app(store);
        let created = create_review_for_test(app.clone()).await;
        let id = created["id"].as_i64().unwrap();
        let response = app
            .oneshot(
                Request::builder()
                    .uri(format!("/api/reviews/{id}"))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let body = response_json(response).await;
        assert_eq!(body["id"], id);
        assert_eq!(body["rating"], 5);
    }

    #[tokio::test]
    async fn get_review_returns_not_found() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/api/reviews/404")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    #[tokio::test]
    async fn update_review_rejects_missing_admin_credentials() {
        let store = MemoryReviewRepository::default();
        let app = test_app(store);
        let created = create_review_for_test(app.clone()).await;
        let id = created["id"].as_i64().unwrap();
        let response = app
            .oneshot(
                Request::builder()
                    .method("PUT")
                    .uri(format!("/api/reviews/{id}"))
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"text":"Попытка без доступа"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn update_review_updates_review() {
        let store = MemoryReviewRepository::default();
        let app = test_app(store);
        let created = create_review_for_test(app.clone()).await;
        let id = created["id"].as_i64().unwrap();
        let response = app
            .oneshot(
                Request::builder()
                    .method("PUT")
                    .uri(format!("/api/reviews/{id}"))
                    .header("authorization", admin_authorization())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"text":"Обновленный отзыв","rating":4}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let body = response_json(response).await;
        assert_eq!(body["text"], "Обновленный отзыв");
        assert_eq!(body["rating"], 4);
        assert_eq!(body["authorName"], "Анна");
    }

    #[tokio::test]
    async fn update_review_rejects_empty_payload() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .method("PUT")
                    .uri("/api/reviews/1")
                    .header("authorization", admin_authorization())
                    .header("content-type", "application/json")
                    .body(Body::from("{}"))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);
    }

    #[tokio::test]
    async fn update_review_rejects_invalid_rating() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .method("PUT")
                    .uri("/api/reviews/1")
                    .header("authorization", admin_authorization())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"rating":0}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);

        let body = response_json(response).await;
        assert_eq!(body["error"], "validation_error");
    }

    #[tokio::test]
    async fn update_review_rejects_too_long_author_name() {
        let app = test_app(MemoryReviewRepository::default());
        let body = serde_json::json!({
            "authorName": "a".repeat(MAX_AUTHOR_NAME_CHARS + 1),
        });
        let response = app
            .oneshot(
                Request::builder()
                    .method("PUT")
                    .uri("/api/reviews/1")
                    .header("authorization", admin_authorization())
                    .header("content-type", "application/json")
                    .body(Body::from(body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);

        let body = response_json(response).await;
        assert_eq!(body["error"], "validation_error");
    }

    #[tokio::test]
    async fn update_review_rejects_too_long_text() {
        let app = test_app(MemoryReviewRepository::default());
        let body = serde_json::json!({
            "text": "a".repeat(MAX_REVIEW_TEXT_CHARS + 1),
        });
        let response = app
            .oneshot(
                Request::builder()
                    .method("PUT")
                    .uri("/api/reviews/1")
                    .header("authorization", admin_authorization())
                    .header("content-type", "application/json")
                    .body(Body::from(body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);

        let body = response_json(response).await;
        assert_eq!(body["error"], "validation_error");
    }

    #[tokio::test]
    async fn update_review_returns_not_found() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .method("PUT")
                    .uri("/api/reviews/404")
                    .header("authorization", admin_authorization())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"text":"Новый текст"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    #[tokio::test]
    async fn delete_review_rejects_wrong_admin_credentials() {
        let store = MemoryReviewRepository::default();
        let app = test_app(store);
        let created = create_review_for_test(app.clone()).await;
        let id = created["id"].as_i64().unwrap();
        let response = app
            .oneshot(
                Request::builder()
                    .method("DELETE")
                    .uri(format!("/api/reviews/{id}"))
                    .header("authorization", "Basic YWRtaW46YmFk")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn delete_review_returns_no_content() {
        let store = MemoryReviewRepository::default();
        let app = test_app(store);
        let created = create_review_for_test(app.clone()).await;
        let id = created["id"].as_i64().unwrap();
        let response = app
            .oneshot(
                Request::builder()
                    .method("DELETE")
                    .uri(format!("/api/reviews/{id}"))
                    .header("authorization", admin_authorization())
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::NO_CONTENT);
    }

    #[tokio::test]
    async fn delete_review_returns_not_found() {
        let app = test_app(MemoryReviewRepository::default());
        let response = app
            .oneshot(
                Request::builder()
                    .method("DELETE")
                    .uri("/api/reviews/404")
                    .header("authorization", admin_authorization())
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    #[tokio::test]
    async fn sea_orm_repository_creates_review() {
        let created_model = review_model(7, "Анна", "Отличная доска", 5);
        let db = MockDatabase::new(DbBackend::Postgres)
            .append_query_results([[created_model]])
            .into_connection();
        let repo = SeaOrmReviewRepository::new(db);

        let review = repo
            .create(NewReview {
                author_name: "Анна".to_owned(),
                text: "Отличная доска".to_owned(),
                rating: 5,
            })
            .await
            .unwrap();

        assert_eq!(review.id, 7);
        assert_eq!(review.author_name, "Анна");
        assert_eq!(review.text, "Отличная доска");
        assert_eq!(review.rating, 5);
        assert_single_statement_contains(repo, r#"INSERT INTO "reviews""#);
    }

    #[tokio::test]
    async fn sea_orm_repository_lists_reviews() {
        let first_model = review_model(1, "Анна", "Отличная доска", 5);
        let second_model = review_model(2, "Игорь", "Быстро привезли", 4);
        let db = MockDatabase::new(DbBackend::Postgres)
            .append_query_results([vec![first_model, second_model]])
            .into_connection();
        let repo = SeaOrmReviewRepository::new(db);

        let reviews = repo.list().await.unwrap();

        assert_eq!(reviews.len(), 2);
        assert_eq!(reviews[0].author_name, "Анна");
        assert_eq!(reviews[1].author_name, "Игорь");

        let log = repo.db.into_transaction_log();
        assert_eq!(log.len(), 1);
        assert!(log[0].statements()[0]
            .sql
            .contains(r#"SELECT "reviews"."id""#));
        assert!(log[0].statements()[0]
            .sql
            .contains(r#"ORDER BY "reviews"."created_at" DESC"#));
    }

    #[tokio::test]
    async fn sea_orm_repository_gets_review() {
        let db = MockDatabase::new(DbBackend::Postgres)
            .append_query_results([[review_model(3, "Анна", "Хороший брус", 5)]])
            .into_connection();
        let repo = SeaOrmReviewRepository::new(db);

        let review = repo.get(3).await.unwrap();

        assert_eq!(review.id, 3);
        assert_eq!(review.author_name, "Анна");
        assert_eq!(review.rating, 5);

        let log = repo.db.into_transaction_log();
        assert_eq!(log.len(), 1);
        assert!(log[0].statements()[0]
            .sql
            .contains(r#"WHERE "reviews"."id" = $1"#));
    }

    #[tokio::test]
    async fn sea_orm_repository_get_returns_not_found() {
        let db = MockDatabase::new(DbBackend::Postgres)
            .append_query_results([Vec::<entity::Model>::new()])
            .into_connection();
        let repo = SeaOrmReviewRepository::new(db);

        let result = repo.get(404).await;

        assert!(matches!(result, Err(ReviewStoreError::NotFound)));
        assert_single_statement_contains(repo, r#"WHERE "reviews"."id" = $1"#);
    }

    #[tokio::test]
    async fn sea_orm_repository_updates_review() {
        let existing_model = review_model(4, "Анна", "Хороший брус", 5);
        let updated_model = review_model(4, "Анна", "Обновленный отзыв", 4);
        let db = MockDatabase::new(DbBackend::Postgres)
            .append_query_results([vec![existing_model], vec![updated_model]])
            .into_connection();
        let repo = SeaOrmReviewRepository::new(db);

        let review = repo
            .update(
                4,
                ReviewPatch {
                    author_name: None,
                    text: Some("Обновленный отзыв".to_owned()),
                    rating: Some(4),
                },
            )
            .await
            .unwrap();

        assert_eq!(review.id, 4);
        assert_eq!(review.author_name, "Анна");
        assert_eq!(review.text, "Обновленный отзыв");
        assert_eq!(review.rating, 4);

        let log = repo.db.into_transaction_log();
        assert_eq!(log.len(), 2);
        assert!(log[0].statements()[0]
            .sql
            .contains(r#"SELECT "reviews"."id""#));
        assert!(log[1].statements()[0]
            .sql
            .contains(r#"UPDATE "reviews" SET"#));
    }

    #[tokio::test]
    async fn sea_orm_repository_update_returns_not_found() {
        let db = MockDatabase::new(DbBackend::Postgres)
            .append_query_results([Vec::<entity::Model>::new()])
            .into_connection();
        let repo = SeaOrmReviewRepository::new(db);

        let result = repo
            .update(
                404,
                ReviewPatch {
                    author_name: Some("Анна".to_owned()),
                    text: None,
                    rating: None,
                },
            )
            .await;

        assert!(matches!(result, Err(ReviewStoreError::NotFound)));
        assert_single_statement_contains(repo, r#"WHERE "reviews"."id" = $1"#);
    }

    #[tokio::test]
    async fn sea_orm_repository_deletes_review() {
        let db = MockDatabase::new(DbBackend::Postgres)
            .append_exec_results([MockExecResult {
                last_insert_id: 0,
                rows_affected: 1,
            }])
            .into_connection();
        let repo = SeaOrmReviewRepository::new(db);

        repo.delete(5).await.unwrap();

        assert_single_statement_contains(repo, r#"DELETE FROM "reviews""#);
    }

    #[tokio::test]
    async fn sea_orm_repository_delete_returns_not_found() {
        let db = MockDatabase::new(DbBackend::Postgres)
            .append_exec_results([MockExecResult {
                last_insert_id: 0,
                rows_affected: 0,
            }])
            .into_connection();
        let repo = SeaOrmReviewRepository::new(db);

        let result = repo.delete(404).await;

        assert!(matches!(result, Err(ReviewStoreError::NotFound)));
        assert_single_statement_contains(repo, r#"DELETE FROM "reviews""#);
    }
}
