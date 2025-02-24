locals {
  web_port = 80
  api_port = 8080
  db_port  = 5432

  web_labels = merge(var.labels, {
    "scope" = "wordsmith-web"
  })

  api_labels = merge(var.labels, {
    "scope" = "wordsmith-api"
  })

  db_labels = merge(var.labels, {
    "scope" = "wordsmith-db"
  })
}
