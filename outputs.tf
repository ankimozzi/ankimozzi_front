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
  description = "Map of S3 bucket names to their bucket names"
}

# DynamoDB 테이블 출력
output "dynamodb_tables" {
  value = { for name, table in data.aws_dynamodb_table.dynamodb_tables : name => table.arn }
  description = "Map of DynamoDB table names to their ARNs"
}

# Glue Job 출력
output "glue_jobs" {
  value = data.external.glue_jobs.result
  description = "List of Glue Job names"
}

# Glue Crawler 출력
output "glue_crawlers" {
  value = data.external.glue_crawlers.result
  description = "List of Glue Crawler names"
}

# Glue Workflow 출력
output "glue_workflows" {
  value = data.external.glue_workflows.result
  description = "List of Glue Workflow names"
}

# Glue Catalog Database 출력
output "glue_catalogs" {
  value = data.external.glue_catalogs.result
  description = "List of Glue Catalog Database names"
}