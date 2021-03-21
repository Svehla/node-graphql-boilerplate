# TODO: extract + test code
resource "aws_route53_zone" "this" {
  name = var.domain

  tags = merge(
    local.tags,
    { Name = var.domain }
  )
}
