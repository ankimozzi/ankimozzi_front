# VPC ID 출력
output "vpc_id" {
  value       = data.aws_vpc.selected_vpc.id
  description = "ID of the selected VPC"
}

# Lambda 함수 이름과 ARN 출력
output "lambda_functions" {
  value = { for name, lambda in data.aws_lambda_function.lambda_functions : name => lambda.arn }
  description = "Map of Lambda function names to their ARNs"
}

# S3 버킷 출력
output "s3_buckets" {
  value = { for name, bucket in data.aws_s3_bucket.s3_buckets : name => bucket.bucket }
  description = "Map of S3 bucket names"
}

# DynamoDB 테이블 출력
output "dynamodb_tables" {
  value = { for name, table in data.aws_dynamodb_table.dynamodb_tables : name => table.arn }
  description = "Map of DynamoDB table names to their ARNs"
}

# API Gateway 리소스 출력
output "api_gateway" {
  value = {
    api_id = data.aws_api_gateway_rest_api.existing_api.id
    root_resource_id = data.aws_api_gateway_resource.existing_resource.id
  }
  description = "API Gateway information"
}

# Glue 리소스 출력
output "glue_resources" {
  value = data.external.glue_resources.result
  description = "Glue resources information"
}