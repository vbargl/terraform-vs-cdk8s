output "web_service_port" {
  description = "value of the port"
  value       = kubernetes_service_v1.wordsmith-example-web.spec[0].port[0].port
}

output "api_service_port" {
  description = "value of the port"
  value       = kubernetes_service_v1.wordsmith-example-api.spec[0].port[0].port
}

output "db_service_port" {
  description = "value of the port"
  value       = kubernetes_service_v1.wordsmith-example-db.spec[0].port[0].port
}

output "web_labels" {
  description = "value of the labels"
  value       = local.web_labels
}

output "api_labels" {
  description = "value of the labels"
  value       = local.api_labels
}

output "db_labels" {
  description = "value of the labels"
  value       = local.db_labels
}
