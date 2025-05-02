use actix_web::{
    error,
    http::header::{ContentType, TryIntoHeaderValue},
};
use std::fmt::Display;

#[derive(Debug)]
pub struct AppError(anyhow::Error);

pub struct AppErrorMessage {
    pub message: String,
}

impl<E> From<E> for AppError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(err.into())
    }
}

impl Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

impl error::ResponseError for AppError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        actix_web::http::StatusCode::INTERNAL_SERVER_ERROR
    }

    fn error_response(&self) -> actix_web::HttpResponse<actix_web::body::BoxBody> {
        let mut res = actix_web::HttpResponse::new(self.status_code());

        res.extensions_mut().insert(AppErrorMessage {
            message: self.0.to_string(),
        });

        res.headers_mut().insert(
            actix_web::http::header::CONTENT_TYPE,
            ContentType::plaintext().try_into_value().unwrap(),
        );

        res.set_body(actix_web::body::BoxBody::new("Internal Server Error"))
    }
}
