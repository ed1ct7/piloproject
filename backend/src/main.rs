use axum::{routing::get, Json, Router};
use serde::Serialize;
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

/// Точка входа: настраивает CORS, регистрирует маршруты и запускает HTTP-сервер
#[tokio::main]
async fn main() {
    // Разрешающий CORS, чтобы статически сгенерированный сайт Nuxt мог обращаться к API.
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/health", get(health))
        .layer(cors);

    let addr = "0.0.0.0:8080";
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("backend слушает на http://{addr}");
    axum::serve(listener, app).await.unwrap();
}
