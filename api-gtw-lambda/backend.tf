
# knowledge inspiration
# > https://blog.gruntwork.io/how-to-manage-terraform-state-28f5697e68fa#.r6xdvtxqe

terraform {
  backend "s3" {
    # Replace this with your bucket name!
    bucket = "serverless-example-terraform-up-and-running-state"
    key    = "global/s3/terraform.tfstate"
    region = "eu-central-1"
    # Replace this with your DynamoDB table name!
    dynamodb_table = "terraform-up-and-running-locks"
    encrypt        = true
  }
}
