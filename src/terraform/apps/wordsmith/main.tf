
resource "kubernetes_namespace" "wordsmith-example" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_service_v1" "wordsmith-example-web" {
  metadata {
    name      = var.web_service_name
    namespace = kubernetes_namespace.wordsmith-example.metadata[0].name
    labels    = local.web_labels
  }

  spec {
    type     = "ClusterIP"
    selector = local.web_labels

    port {
      name        = "web"
      port        = local.web_port
      target_port = "web"
    }
  }
}

resource "kubernetes_deployment_v1" "wordsmith-example-web" {
  metadata {
    name      = var.web_deployment_name
    namespace = kubernetes_namespace.wordsmith-example.metadata[0].name
    labels    = local.web_labels
  }

  spec {
    replicas = 1

    selector {
      match_labels = local.web_labels
    }

    template {
      metadata {
        labels = local.web_labels
      }

      spec {
        container {
          name  = var.web_container_name
          image = "ghcr.io/vbargl/wordsmith-web:${var.web_image_tag}"
          env {
            name  = "API_ADDRESS"
            value = "${var.api_service_name}:${local.api_port}"
          }
          port {
            name           = "web"
            container_port = local.web_port
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "wordsmith-example-api" {
  metadata {
    name      = var.api_service_name
    namespace = kubernetes_namespace.wordsmith-example.metadata[0].name
    labels    = local.db_labels
  }

  spec {
    type     = "ClusterIP"
    selector = local.db_labels

    port {
      name        = "api"
      port        = local.api_port
      target_port = "api"
    }
  }

}

resource "kubernetes_deployment_v1" "wordsmith-example-api" {
  metadata {
    name      = var.api_deployment_name
    namespace = kubernetes_namespace.wordsmith-example.metadata[0].name
    labels    = local.db_labels
  }

  spec {
    replicas = 1

    selector {
      match_labels = local.db_labels
    }

    template {
      metadata {
        labels = local.db_labels
      }

      spec {
        container {
          name  = var.api_container_name
          image = "ghcr.io/vbargl/wordsmith-api:${var.api_image_tag}"
          env {
            name  = "DB_ADDRESS"
            value = "${var.db_service_name}:${local.db_port}"
          }
          port {
            name           = "api"
            container_port = local.api_port
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "wordsmith-example-db" {
  metadata {
    name      = var.db_service_name
    namespace = kubernetes_namespace.wordsmith-example.metadata[0].name
    labels    = local.db_labels
  }

  spec {
    selector = local.db_labels

    port {
      name        = "postgres"
      port        = local.db_port
      target_port = "postgres"
    }
  }

}

resource "kubernetes_deployment_v1" "wordsmith-example-db" {
  metadata {
    name      = var.db_deployment_name
    namespace = kubernetes_namespace.wordsmith-example.metadata[0].name
    labels    = local.db_labels
  }

  spec {
    replicas = 1

    selector {
      match_labels = local.db_labels
    }

    template {
      metadata {
        labels = local.db_labels
      }

      spec {
        container {
          name  = var.db_container_name
          image = "docker.io/postgres:${var.db_image_tag}"

          port {
            name           = "postgres"
            container_port = local.db_port
          }

          volume_mount {
            name       = var.db_schema_name
            mount_path = "/docker-entrypoint-initdb.d"
          }
        }

        volume {
          name = var.db_schema_name

          config_map {
            name = kubernetes_config_map_v1.wordsmith-example-db-schema.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_config_map_v1" "wordsmith-example-db-schema" {
  metadata {
    name      = var.db_schema_name
    namespace = kubernetes_namespace.wordsmith-example.metadata[0].name
    labels    = local.db_labels
  }

  data = {
    "init.sql" = file("../_common/wordsmith-db/init.sql")
  }
}
