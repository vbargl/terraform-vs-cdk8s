module "whoami-example" {
  source = "./apps/whoami"

  labels = {
    "app" = "whoami-example"
  }

  namespace       = "whoami-example-app"
  service_name    = "whoami-example"
  deployment_name = "whoami-example"
  container_name  = "whoami-example"

}

module "wordsmith-example" {
  source = "./apps/wordsmith"

  labels = {
    "app" = "wordsmith-example"
  }

  namespace           = "wordsmith-example-app"
  web_service_name    = "wordsmith-example-web"
  web_deployment_name = "wordsmith-example-web"
  web_container_name  = "wordsmith-example-web"

  api_service_name    = "wordsmith-example-api"
  api_deployment_name = "wordsmith-example-api"
  api_container_name  = "wordsmith-example-api"

  db_service_name    = "wordsmith-example-db"
  db_deployment_name = "wordsmith-example-db"
  db_container_name  = "wordsmith-example-db"
  db_schema_name     = "wordsmith-example-db-schema"

}
