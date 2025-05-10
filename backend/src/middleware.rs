use crate::error::AppErrorMessage;
use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    middleware::Next,
};
use log::error;

pub async fn log_internal_error(
    req: ServiceRequest,
    next: Next<impl MessageBody>,
) -> actix_web::Result<ServiceResponse<impl MessageBody>> {
    let request_line = format!("[{} {}]", req.method(), req.path());
    let res = next.call(req).await?;
    {
        let extensions = res.response().extensions();
        let message = extensions.get::<AppErrorMessage>();

        if let Some(message) = message {
            error!("{} {}", request_line, message.message)
        }
    }

    Ok(res)
}
