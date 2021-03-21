
output "api_gateway_base_url" {
  value = aws_api_gateway_deployment.this.invoke_url
}

output "base_url" {
  value = "https://${aws_route53_record.this.name}"
}
