variable "namespace" {
  description = "Namespace to deploy the app"
  type        = string
}

variable "labels" {
  description = "Labels to apply to the resources"
  type        = map(string)
}

variable "web_service_name" {
  description = "Name of the service"
  type        = string
}

variable "web_deployment_name" {
  description = "Name of the deployment"
  type        = string
}

variable "web_container_name" {
  description = "Name of the container"
  type        = string
}

variable "web_image_tag" {
  description = "tag of image to use"
  default     = "v1.0.0"
}

variable "api_service_name" {
  description = "Name of the service"
  type        = string
}

variable "api_deployment_name" {
  description = "Name of the deployment"
  type        = string
}

variable "api_container_name" {
  description = "Name of the container"
  type        = string
}

variable "api_image_tag" {
  description = "tag of image to use"
  default     = "v1.0.0"
}

variable "db_service_name" {
  description = "Name of the service"
  type        = string
}

variable "db_deployment_name" {
  description = "Name of the deployment"
  type        = string
}

variable "db_container_name" {
  description = "Name of the container"
  type        = string
}

variable "db_schema_name" {
  description = "Name of the schema"
  type        = string
}

variable "db_image_tag" {
  description = "tag of image to use"
  default     = "10.0-alpine"
}

