
variable "project" {
  description = "The name of the project"
  type        = string
}

variable "environment" {
  description = "This is the environment subdomain where your webapp is deployed. production, or stage-1 or whatever"
  type        = string
}
variable "url_prefix" {
  description = "This is the environment subdomain where your webapp is deployed. production, or stage-1 or whatever"
  type        = string
}
# TODO: add more modules
# variable "stage_1_prefix" {
#   description = "This is the environment where your webapp is deployed. production, or stage-1 or whatever"
#   type        = string
# }
# variable "production_prefix" {
#   description = "This is the environment where your webapp is deployed. production, or stage-1 or whatever"
#   type        = string
# }

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
