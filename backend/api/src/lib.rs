use crate::openapi::ApiDoc;
use actix_web::middleware::{Compress, Logger};
use actix_web::web::scope;
use actix_web::{App, HttpServer};
use log::LevelFilter;
use migration::{Migrator, MigratorTrait};
use sea_orm::{ConnectOptions, Database};
use service::db::constants::MAX_CONNECTIONS;
use std::env;
use std::time::Duration;
use utoipa::OpenApi;
use utoipa_swagger_ui::{SwaggerUi, Url};

mod openapi;

#[actix_web::main]
pub async fn start() -> anyhow::Result<()> {
	let port = env::var("PORT").unwrap_or("8080".to_string());
	let worker_amount = match env::var("HTTP_WORKERS") {
		Ok(workers) => workers.parse::<usize>()?,
		Err(_) => num_cpus::get(),
	};

	let mut opt = ConnectOptions::new(env::var("DATABASE_URL")?);
	opt.max_connections(MAX_CONNECTIONS);
	opt.sqlx_logging_level(LevelFilter::Debug);
	opt.sqlx_slow_statements_logging_settings(LevelFilter::Warn, Duration::from_secs(15));

	let conn = Database::connect(opt).await?;
	Migrator::up(&conn, None).await?;

	let serv = HttpServer::new(move || {
		App::new()
			.wrap(Compress::default())
			.service(scope("/api").wrap(Logger::new(
				"%{r}a %t \"%r\" %s %b \"%{Referer}i\" \"%{User-Agent}i\" %T",
			)))
			.service(SwaggerUi::new("/swagger-ui/{_:.*}").urls(vec![(
				Url::new("RetroRealm API", "/api-docs/openapi.json"),
				ApiDoc::openapi(),
			)]))
	})
		.bind(format!("0.0.0.0:{}", port))?
		.shutdown_timeout(15)
		.workers(worker_amount)
		.run();

	serv.await?;

	Ok(())
}

pub fn main() {
	let result = start();

	if let Some(err) = result.err() {
		println!("Error: {err}");
	}
}
