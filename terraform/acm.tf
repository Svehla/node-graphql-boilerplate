
resource "aws_acm_certificate" "api_gateway" {
  domain_name       = "${var.url_prefix}.api.${var.domain}"
  validation_method = "DNS"

  tags = merge(local.tags, {
    Name = "api-${var.url_prefix}-${var.project}"
  })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "api_gateway" {
  certificate_arn         = aws_acm_certificate.api_gateway.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_api_gateway : record.fqdn]
}
