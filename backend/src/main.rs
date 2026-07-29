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
use sea_orm::Database;
use serde::Serialize;
use std::{env, sync::Arc};
use tower_http::cors::{AllowOrigin, CorsLayer};

const DEFAULT_ALLOWED_ORIGINS: &str =
    "http://localhost:3000,http://127.0.0.1:3000,https://pilorama-razbegaevo.clients.site";
const REQUEST_BODY_LIMIT_BYTES: usize = 16 * 1024;

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
) -> Router {
    Router::new()
        .route("/api/health", get(health))
        .merge(reviews::routes(review_store, admin_credentials))
        .layer(DefaultBodyLimit::max(REQUEST_BODY_LIMIT_BYTES))
        .layer(cors_layer())
        .layer(middleware::from_fn(security_headers))
}

fn cors_layer() -> CorsLayer {
    let allowed_origins =
        env::var("ALLOWED_ORIGINS").unwrap_or_else(|_| DEFAULT_ALLOWED_ORIGINS.to_owned());
    let allowed_origins = parse_allowed_origins(&allowed_origins)
        .expect("ALLOWED_ORIGINS должен содержать корректные http/https origin без wildcard");

    CorsLayer::new()
        .allow_origin(AllowOrigin::list(allowed_origins))
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
}

fn parse_allowed_origins(value: &str) -> Result<Vec<HeaderValue>, String> {
    let origins = value
        .split(',')
        .map(str::trim)
        .filter(|origin| !origin.is_empty())
        .map(|origin| {
            if origin == "*" {
                return Err("wildcard origin запрещен".to_owned());
            }

            if !origin.starts_with("http://") && !origin.starts_with("https://") {
                return Err(format!(
                    "origin `{origin}` должен начинаться с http:// или https://"
                ));
            }

            origin
                .parse::<HeaderValue>()
                .map_err(|_| format!("origin `{origin}` не является корректным HTTP-заголовком"))
        })
        .collect::<Result<Vec<_>, _>>()?;

    if origins.is_empty() {
        return Err("список разрешенных origin не должен быть пустым".to_owned());
    }

    Ok(origins)
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
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL должен быть задан для подключения к PostgreSQL");
    let db = Database::connect(database_url)
        .await
        .expect("не удалось подключиться к PostgreSQL");
    let review_store = Arc::new(reviews::SeaOrmReviewRepository::new(db));
    let admin_credentials =
        reviews::AdminCredentials::from_env().expect("не удалось настроить доступ к админке");

    let addr = "0.0.0.0:8080";
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("backend слушает на http://{addr}");
    axum::serve(listener, app(review_store, admin_credentials))
        .await
        .unwrap();
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
        let response = app(
            Arc::new(EmptyReviewRepository),
            reviews::AdminCredentials::new("admin", "secret"),
        )
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
        let response = app(
            Arc::new(EmptyReviewRepository),
            reviews::AdminCredentials::new("admin", "secret"),
        )
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
        let response = app(
            Arc::new(EmptyReviewRepository),
            reviews::AdminCredentials::new("admin", "secret"),
        )
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
        let response = app(
            Arc::new(EmptyReviewRepository),
            reviews::AdminCredentials::new("admin", "secret"),
        )
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

    #[tokio::test]
    async fn review_requests_reject_large_payloads() {
        let oversized_text = "a".repeat(REQUEST_BODY_LIMIT_BYTES + 1);
        let body = serde_json::json!({
            "authorName": "Анна",
            "text": oversized_text,
            "rating": 5,
        });

        let response = app(
            Arc::new(EmptyReviewRepository),
            reviews::AdminCredentials::new("admin", "secret"),
        )
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
