
# inspiration
# > https://learn.hashicorp.com/tutorials/terraform/lambda-api-gateway?in=terraform/aws

data "archive_file" "lambda_admin_service_zip" {
  type        = "zip"
  source_dir  = "../dist/serverless_admin_index"
  output_path = "../serverless_admin_index-output.zip"
}

data "archive_file" "lambda_iterator_service_zip" {
  type        = "zip"
  source_dir  = "../dist/serverless_iterator_index"
  output_path = "../serverless_iterator_index-output.zip"
}


resource "aws_lambda_function" "admin_service" {
  filename         = "../serverless_admin_index_zip-output.zip"
  source_code_hash = data.archive_file.lambda_admin_service_zip.output_base64sha256

  function_name = "${var.project}_${var.environment}_admin_service"

  # "main" is the filename within the zip file (index.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "index.handler"
  runtime = "nodejs14.x"

  memory_size = 2048

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "iterator_service" {
  filename         = "../serverless_iterator_index_lambda-output.zip"
  source_code_hash = data.archive_file.lambda_iterator_service_zip.output_base64sha256

  function_name = "${var.project}_${var.environment}_iterator_service"

  # "main" is the filename within the zip file (index.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "index.handler"
  runtime = "nodejs14.x"

  memory_size = 512

  role = aws_iam_role.lambda_exec.arn
}


data "aws_iam_policy_document" "AWSLambdaTrustPolicy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# IAM role which dictates what other AWS services the Lambda function
# may access.
resource "aws_iam_role" "lambda_exec" {
  name = "lambda_${var.project}_${var.environment}_admin_service"

  # TODO: add proper permisssions to write into cloudWatch
  assume_role_policy = data.aws_iam_policy_document.AWSLambdaTrustPolicy.json
}

resource "aws_iam_role_policy" "main" {
  name = "${var.project}_${var.environment}_dynamo_${var.allowDynamoTableName}_access"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:BatchGet*",
          "dynamodb:DescribeStream",
          "dynamodb:DescribeTable",
          "dynamodb:Get*",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchWrite*",
          "dynamodb:CreateTable",
          "dynamodb:Delete*",
          "dynamodb:Update*",
          "dynamodb:PutItem"
        ]
        Resource = [
          "arn:aws:dynamodb:${var.region}:*:table/${var.allowDynamoTableName}",
          "arn:aws:dynamodb:${var.region}:*:table/${var.allowDynamoTableName}/index/*"
        ]
      }
    ]
  })
}

# TODO: is this redundnat resource?
resource "aws_iam_role_policy_attachment" "terraform_lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


# TODO: what about to make lambda module?
// --------------------------
// ---- iterator service ----
// --------------------------
resource "aws_api_gateway_resource" "proxy_iterator_root" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "iterator"
}

resource "aws_api_gateway_resource" "proxy_iterator" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.proxy_iterator_root.id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy_iterator" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.proxy_iterator.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "proxy_iterator_root" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.proxy_iterator_root.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "iterator_lambda" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_method.proxy_iterator.resource_id
  http_method = aws_api_gateway_method.proxy_iterator.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.iterator_service.invoke_arn
}

resource "aws_api_gateway_integration" "iterator_lambda_root" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_method.proxy_iterator_root.resource_id
  http_method = aws_api_gateway_method.proxy_iterator_root.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.iterator_service.invoke_arn
}

resource "aws_lambda_permission" "iterator_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.iterator_service.function_name
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from anymethod on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.this.execution_arn}/*/*"
}


// -----------------------
// ---- admin service ----
// -----------------------

resource "aws_api_gateway_resource" "proxy_admin_root" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "admin"
}

resource "aws_api_gateway_resource" "proxy_admin" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.proxy_admin_root.id
  path_part   = "{proxy+}"
}


resource "aws_api_gateway_method" "proxy_admin" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.proxy_admin.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "proxy_admin_root" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.proxy_admin_root.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "admin_lambda" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_method.proxy_admin.resource_id
  http_method = aws_api_gateway_method.proxy_admin.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.admin_service.invoke_arn
}

resource "aws_api_gateway_integration" "admin_lambda_root" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_method.proxy_admin_root.resource_id
  http_method = aws_api_gateway_method.proxy_admin_root.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.admin_service.invoke_arn
}

resource "aws_lambda_permission" "admin_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_service.function_name
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.this.execution_arn}/*/*"
}

// ---- deploy api gateway ----

resource "aws_api_gateway_deployment" "this" {
  depends_on = [
    aws_api_gateway_integration.admin_lambda,
    aws_api_gateway_integration.admin_lambda_root,
    aws_api_gateway_integration.iterator_lambda,
    aws_api_gateway_integration.iterator_lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.this.id
  # TODO make more instances
  stage_name = var.environment
}

