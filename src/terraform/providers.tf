terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.32.0"
    }
  }
}

provider "kubernetes" {
  config_path = pathexpand(local.kubeconfig)
}
