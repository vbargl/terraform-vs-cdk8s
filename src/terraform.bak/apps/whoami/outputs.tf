output "service_port" {
  description = "value of the port"
  value       = kubernetes_service_v1.whoami.spec[0].port[0].port
}
