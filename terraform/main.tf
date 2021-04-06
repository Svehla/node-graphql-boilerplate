
# knowledge inspiration
# > https://blog.gruntwork.io/how-to-manage-terraform-state-28f5697e68fa#.r6xdvtxqe

terraform {
  backend "s3" {
    # Replace this with your bucket name!
    bucket = "node-graphql-boilerplate-terraform-up-and-running-state"
    key    = "global/s3/terraform.tfstate"
    # TODO: add local.region
    region = "eu-central-1"
    # Replace this with your DynamoDB table name!
    dynamodb_table = "node-graphql-boilerplate-terraform-up-and-running-locks"
    encrypt        = true
  }

  required_version = "v0.14.8"
}


locals {
  region  = "eu-central-1"
  domain  = "dailyfaily.com"
  project = "node-graphql-boilerplate"
}

provider "aws" {
  profile = "default"
  region  = local.region
}

# module "serverless_be_app__production" {
#   source = "./modules/serverless_be_app"

#   environment = "production"
#   url_prefix  = "ngb-production"

#   region  = local.region
#   domain  = local.domain
#   project = local.project

# }


module "serverless_be_app__stage_1" {
  source = "./modules/serverless_be_app"

  environment = "stage_1"
  url_prefix  = "stage-1"

  region  = local.region
  domain  = local.domain
  project = local.project
}


# module "lol_stage_2" {
#   source = "./modules/serverless_be_app"

#   url_prefix  = "stage-2"
#   environment = "stage_2"

#   region  = local.region
#   domain  = local.domain
#   project = local.project
# }
