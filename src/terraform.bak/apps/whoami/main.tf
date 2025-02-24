
resource "kubernetes_namespace" "whoami" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_service_v1" "whoami" {

  metadata {
    name      = var.service_name
    namespace = var.namespace
    labels    = var.labels
  }
  spec {
    type     = "ClusterIP"
    selector = var.labels
    port {
      port        = 80
      target_port = "web"
    }
  }
}

resource "kubernetes_deployment_v1" "whoami" {
  metadata {
    name      = var.deployment_name
    namespace = var.namespace
    labels    = var.labels
  }
  spec {
    replicas = 1
    strategy {
      type = "RollingUpdate"
      rolling_update {
        max_surge       = 1
        max_unavailable = 0
      }
    }
    selector {
      match_labels = var.labels
    }
    template {
      metadata {
        labels = var.labels
      }
      spec {
        container {
          name  = var.container_name
          image = "docker.io/traefik/whoami:${var.image_tag}"

          port {
            name           = "web"
            container_port = 80
          }
        }
      }
    }
  }

}
