
variable "project" {
  description = "The name of the project"
  type        = string
}

# TODO: rename to env?
variable "prefix" {
  description = "This is the environment where your webapp is deployed. production, or development"
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
