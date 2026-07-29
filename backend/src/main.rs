mod reviews;

use axum::{
    body::Body,
    extract::DefaultBodyLimit,
    http::{header, HeaderValue, Method, Request},
    middleware::{self, Next},
    response::Response,
    routing::get,
    Json, Router,
};
use sea_orm::{Database, DbErr};
use serde::Serialize;
use std::{env, fmt, io, sync::Arc};
use tower_http::cors::{AllowOrigin, CorsLayer};

const DEFAULT_ALLOWED_ORIGINS: &str =
    "http://localhost:3000,http://127.0.0.1:3000,https://pilorama-razbegaevo.clients.site";
const REQUEST_BODY_LIMIT_BYTES: usize = 16 * 1024;
const LISTEN_ADDR: &str = "0.0.0.0:8080";

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

fn app(
    review_store: Arc<dyn reviews::ReviewRepository>,
    admin_credentials: reviews::AdminCredentials,
) -> Result<Router, AllowedOriginsError> {
    Ok(Router::new()
        .route("/api/health", get(health))
        .merge(reviews::routes(review_store, admin_credentials))
        .layer(DefaultBodyLimit::max(REQUEST_BODY_LIMIT_BYTES))
        .layer(cors_layer()?)
        .layer(middleware::from_fn(security_headers)))
}

fn cors_layer() -> Result<CorsLayer, AllowedOriginsError> {
    let allowed_origins =
        env::var("ALLOWED_ORIGINS").unwrap_or_else(|_| DEFAULT_ALLOWED_ORIGINS.to_owned());
    let allowed_origins = parse_allowed_origins(&allowed_origins)?;

    Ok(CorsLayer::new()
        .allow_origin(AllowOrigin::list(allowed_origins))
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE]))
}

#[derive(Clone, Debug, PartialEq, Eq)]
enum AllowedOriginsError {
    Empty,
    Wildcard,
    InvalidScheme { origin: String },
    InvalidHeader { origin: String },
}

impl fmt::Display for AllowedOriginsError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Empty => formatter.write_str("список разрешенных origin не должен быть пустым"),
            Self::Wildcard => formatter.write_str("wildcard origin запрещен"),
            Self::InvalidScheme { origin } => {
                write!(
                    formatter,
                    "origin `{origin}` должен начинаться с http:// или https://"
                )
            }
            Self::InvalidHeader { origin } => {
                write!(
                    formatter,
                    "origin `{origin}` не является корректным HTTP-заголовком"
                )
            }
        }
    }
}

impl std::error::Error for AllowedOriginsError {}

#[derive(Debug)]
enum StartupError {
    MissingDatabaseUrl,
    InvalidDatabaseUrlUnicode,
    DatabaseConnect(DbErr),
    AdminCredentials(reviews::AdminCredentialsError),
    AllowedOrigins(AllowedOriginsError),
    Bind {
        addr: &'static str,
        source: io::Error,
    },
    Serve(io::Error),
}

impl StartupError {
    fn database_url(error: env::VarError) -> Self {
        match error {
            env::VarError::NotPresent => Self::MissingDatabaseUrl,
            env::VarError::NotUnicode(_) => Self::InvalidDatabaseUrlUnicode,
        }
    }
}

impl fmt::Display for StartupError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::MissingDatabaseUrl => {
                formatter.write_str("DATABASE_URL должен быть задан для подключения к PostgreSQL")
            }
            Self::InvalidDatabaseUrlUnicode => {
                formatter.write_str("DATABASE_URL должен быть корректной unicode-строкой")
            }
            Self::DatabaseConnect(error) => {
                write!(formatter, "не удалось подключиться к PostgreSQL: {error}")
            }
            Self::AdminCredentials(error) => {
                write!(formatter, "не удалось настроить доступ к админке: {error}")
            }
            Self::AllowedOrigins(error) => {
                write!(formatter, "ALLOWED_ORIGINS содержит ошибку: {error}")
            }
            Self::Bind { addr, source } => {
                write!(formatter, "не удалось занять адрес {addr}: {source}")
            }
            Self::Serve(error) => write!(formatter, "HTTP-сервер остановился с ошибкой: {error}"),
        }
    }
}

impl std::error::Error for StartupError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            Self::DatabaseConnect(error) => Some(error),
            Self::AdminCredentials(error) => Some(error),
            Self::AllowedOrigins(error) => Some(error),
            Self::Bind { source, .. } => Some(source),
            Self::Serve(error) => Some(error),
            Self::MissingDatabaseUrl | Self::InvalidDatabaseUrlUnicode => None,
        }
    }
}

impl From<reviews::AdminCredentialsError> for StartupError {
    fn from(error: reviews::AdminCredentialsError) -> Self {
        Self::AdminCredentials(error)
    }
}

impl From<AllowedOriginsError> for StartupError {
    fn from(error: AllowedOriginsError) -> Self {
        Self::AllowedOrigins(error)
    }
}

fn parse_allowed_origins(value: &str) -> Result<Vec<HeaderValue>, AllowedOriginsError> {
    let origins = value
        .split(',')
        .map(str::trim)
        .filter(|origin| !origin.is_empty())
        .map(parse_allowed_origin)
        .collect::<Result<Vec<_>, _>>()?;

    if origins.is_empty() {
        return Err(AllowedOriginsError::Empty);
    }

    Ok(origins)
}

fn parse_allowed_origin(origin: &str) -> Result<HeaderValue, AllowedOriginsError> {
    if origin == "*" {
        return Err(AllowedOriginsError::Wildcard);
    }

    if !origin.starts_with("http://") && !origin.starts_with("https://") {
        return Err(AllowedOriginsError::InvalidScheme {
            origin: origin.to_owned(),
        });
    }

    origin
        .parse::<HeaderValue>()
        .map_err(|_| AllowedOriginsError::InvalidHeader {
            origin: origin.to_owned(),
        })
}

async fn security_headers(request: Request<Body>, next: Next) -> Response {
    let mut response = next.run(request).await;
    let headers = response.headers_mut();

    headers.insert(
        header::X_CONTENT_TYPE_OPTIONS,
        HeaderValue::from_static("nosniff"),
    );
    headers.insert(header::X_FRAME_OPTIONS, HeaderValue::from_static("DENY"));
    headers.insert(
        header::REFERRER_POLICY,
        HeaderValue::from_static("strict-origin-when-cross-origin"),
    );
    headers.insert(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static("default-src 'none'; frame-ancestors 'none'; base-uri 'none'"),
    );
    headers.insert(
        "permissions-policy",
        HeaderValue::from_static("camera=(), microphone=(), geolocation=(), payment=()"),
    );

    response
}

/// Точка входа: настраивает CORS, регистрирует маршруты и запускает HTTP-сервер
#[tokio::main]
async fn main() {
    if let Err(error) = run().await {
        eprintln!("backend startup error: {error}");
        std::process::exit(1);
    }
}

async fn run() -> Result<(), StartupError> {
    let database_url = env::var("DATABASE_URL").map_err(StartupError::database_url)?;
    let db = Database::connect(database_url)
        .await
        .map_err(StartupError::DatabaseConnect)?;
    let review_store = Arc::new(reviews::SeaOrmReviewRepository::new(db));
    let admin_credentials = reviews::AdminCredentials::from_env()?;

    let listener = tokio::net::TcpListener::bind(LISTEN_ADDR)
        .await
        .map_err(|source| StartupError::Bind {
            addr: LISTEN_ADDR,
            source,
        })?;
    println!("backend слушает на http://{LISTEN_ADDR}");
    axum::serve(listener, app(review_store, admin_credentials)?)
        .await
        .map_err(StartupError::Serve)
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

    fn test_app() -> Router {
        app(
            Arc::new(EmptyReviewRepository),
            reviews::AdminCredentials::new("admin", "secret"),
        )
        .unwrap()
    }

    #[tokio::test]
    async fn health_returns_ok_status_and_service() {
        let response = test_app()
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

    #[tokio::test]
    async fn responses_include_security_headers() {
        let response = test_app()
            .oneshot(
                Request::builder()
                    .uri("/api/health")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        let headers = response.headers();
        assert_eq!(
            headers.get(header::X_CONTENT_TYPE_OPTIONS).unwrap(),
            "nosniff"
        );
        assert_eq!(headers.get(header::X_FRAME_OPTIONS).unwrap(), "DENY");
        assert_eq!(
            headers.get(header::REFERRER_POLICY).unwrap(),
            "strict-origin-when-cross-origin"
        );
        assert!(headers
            .get(header::CONTENT_SECURITY_POLICY)
            .unwrap()
            .to_str()
            .unwrap()
            .contains("frame-ancestors 'none'"));
    }

    #[tokio::test]
    async fn cors_allows_configured_origins() {
        let response = test_app()
            .oneshot(
                Request::builder()
                    .method("OPTIONS")
                    .uri("/api/admin/session")
                    .header(header::ORIGIN, "http://127.0.0.1:3000")
                    .header(header::ACCESS_CONTROL_REQUEST_METHOD, "GET")
                    .header(header::ACCESS_CONTROL_REQUEST_HEADERS, "authorization")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(
            response
                .headers()
                .get(header::ACCESS_CONTROL_ALLOW_ORIGIN)
                .unwrap(),
            "http://127.0.0.1:3000"
        );
    }

    #[tokio::test]
    async fn cors_does_not_allow_unknown_origins() {
        let response = test_app()
            .oneshot(
                Request::builder()
                    .method("OPTIONS")
                    .uri("/api/admin/session")
                    .header(header::ORIGIN, "https://evil.example")
                    .header(header::ACCESS_CONTROL_REQUEST_METHOD, "GET")
                    .header(header::ACCESS_CONTROL_REQUEST_HEADERS, "authorization")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert!(response
            .headers()
            .get(header::ACCESS_CONTROL_ALLOW_ORIGIN)
            .is_none());
    }

    #[test]
    fn parse_allowed_origins_rejects_empty_list() {
        assert_eq!(
            parse_allowed_origins(" , "),
            Err(AllowedOriginsError::Empty)
        );
    }

    #[test]
    fn parse_allowed_origins_rejects_wildcard() {
        assert_eq!(
            parse_allowed_origins("*"),
            Err(AllowedOriginsError::Wildcard)
        );
    }

    #[test]
    fn parse_allowed_origins_rejects_invalid_scheme() {
        assert_eq!(
            parse_allowed_origins("ftp://example.com"),
            Err(AllowedOriginsError::InvalidScheme {
                origin: "ftp://example.com".to_owned(),
            })
        );
    }

    #[test]
    fn parse_allowed_origins_rejects_invalid_header() {
        assert_eq!(
            parse_allowed_origins("https://example.com/\nmalicious"),
            Err(AllowedOriginsError::InvalidHeader {
                origin: "https://example.com/\nmalicious".to_owned(),
            })
        );
    }

    #[tokio::test]
    async fn review_requests_reject_large_payloads() {
        let oversized_text = "a".repeat(REQUEST_BODY_LIMIT_BYTES + 1);
        let body = serde_json::json!({
            "authorName": "Анна",
            "text": oversized_text,
            "rating": 5,
        });

        let response = test_app()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/reviews")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::PAYLOAD_TOO_LARGE);
    }
}
