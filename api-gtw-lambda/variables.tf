

variable "aws_access_key" {
  type = string
}

variable "aws_secret_key" {
  type = string
}

variable "prefix" {
  description = "This is the environment where your webapp is deployed. production, or development"
  type        = string
}
