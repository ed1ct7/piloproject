mod reviews;

use axum::{routing::get, Json, Router};
use sea_orm::Database;
use serde::Serialize;
use std::{env, sync::Arc};
use tower_http::cors::{Any, CorsLayer};

/// Ответ проверки работоспособности сервиса
#[derive(Serialize)]
struct Health {
    status: &'static str,
    service: &'static str,
}

/// Возвращает состояние работоспособности сервиса
///
/// # Возвращаемое значение
///
/// JSON с признаком состояния сервиса и его именем
async fn health() -> Json<Health> {
    Json(Health {
        status: "ok",
        service: "backend",
    })
}

fn app(review_store: Arc<dyn reviews::ReviewRepository>) -> Router {
    // Разрешающий CORS, чтобы статически сгенерированный сайт Nuxt мог обращаться к API.
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .route("/api/health", get(health))
        .merge(reviews::routes(review_store))
        .layer(cors)
}

/// Точка входа: настраивает CORS, регистрирует маршруты и запускает HTTP-сервер
#[tokio::main]
async fn main() {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL должен быть задан для подключения к PostgreSQL");
    let db = Database::connect(database_url)
        .await
        .expect("не удалось подключиться к PostgreSQL");
    let review_store = Arc::new(reviews::SeaOrmReviewRepository::new(db));

    let addr = "0.0.0.0:8080";
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("backend слушает на http://{addr}");
    axum::serve(listener, app(review_store)).await.unwrap();
}

#[cfg(test)]
mod tests {
    use super::*;
    use async_trait::async_trait;
    use axum::{
        body::{to_bytes, Body},
        http::{Request, StatusCode},
    };
    use tower::ServiceExt;

    struct EmptyReviewRepository;

    #[async_trait]
    impl reviews::ReviewRepository for EmptyReviewRepository {
        async fn create(
            &self,
            _new_review: reviews::NewReview,
        ) -> Result<reviews::Review, reviews::ReviewStoreError> {
            unreachable!("health endpoint не обращается к отзывам")
        }

        async fn list(&self) -> Result<Vec<reviews::Review>, reviews::ReviewStoreError> {
            unreachable!("health endpoint не обращается к отзывам")
        }

        async fn get(&self, _id: i32) -> Result<reviews::Review, reviews::ReviewStoreError> {
            unreachable!("health endpoint не обращается к отзывам")
        }

        async fn update(
            &self,
            _id: i32,
            _patch: reviews::ReviewPatch,
        ) -> Result<reviews::Review, reviews::ReviewStoreError> {
            unreachable!("health endpoint не обращается к отзывам")
        }

        async fn delete(&self, _id: i32) -> Result<(), reviews::ReviewStoreError> {
            unreachable!("health endpoint не обращается к отзывам")
        }
    }

    #[tokio::test]
    async fn health_returns_ok_status_and_service() {
        let response = app(Arc::new(EmptyReviewRepository))
            .oneshot(
                Request::builder()
                    .uri("/api/health")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let bytes = to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let body: serde_json::Value = serde_json::from_slice(&bytes).unwrap();

        assert_eq!(
            body,
            serde_json::json!({
                "status": "ok",
                "service": "backend",
            })
        );
    }
}
