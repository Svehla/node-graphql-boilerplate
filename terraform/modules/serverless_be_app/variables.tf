
variable "project" {
  description = "The name of the project"
  type        = string
}

variable "environment" {
  description = "This is the environment name which is used to add proper names to AWS objects"
  type        = string
}

variable "url_prefix" {
  description = "This is the environment subdomain where your webapp is deployed. production, or stage-1 or whatever"
  type        = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "region" {
  type = string
}

variable "domain" {
  description = "domain"
}
