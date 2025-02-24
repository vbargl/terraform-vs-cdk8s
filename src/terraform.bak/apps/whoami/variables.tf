variable "namespace" {
  description = "Namespace to deploy the app"
}

variable "labels" {
  description = "Labels to apply to the app"
  type        = map(string)
}

variable "service_name" {
  description = "Name of the service"
  type        = string
}

variable "deployment_name" {
  description = "Name of the deployment"
  type        = string
}

variable "container_name" {
  description = "Name of the container"
  type        = string
}

variable "image_tag" {
  description = "tag of image to use"
  default     = "v1.10.4"
}
