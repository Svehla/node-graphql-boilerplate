
locals {
  tags = merge(var.tags, {
    project = var.project
    env     = var.environment
  })
}

