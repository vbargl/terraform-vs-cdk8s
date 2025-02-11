variable "kubeconfig" {
  description = "Path to the kubeconfig file"
  default     = "../../infrastructure/minikube/kubeconfig"
}

locals {
  kubeconfig = abspath(var.kubeconfig)
}
