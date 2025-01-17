provider "aws" {
  region = "us-west-1"
}

# VPC 가져오기
data "aws_vpc" "selected_vpc" {
  filter {
    name   = "tag:Name"
    values = [var.vpc_name]
  }
}

# Lambda 함수 가져오기
data "aws_lambda_function" "lambda_functions" {
  for_each      = toset(var.lambda_names)
  function_name = each.value
}

# S3 버킷 가져오기
data "aws_s3_bucket" "s3_buckets" {
  for_each = toset(var.s3_bucket_names)
  bucket   = each.value
}

# DynamoDB 테이블 가져오기
data "aws_dynamodb_table" "dynamodb_tables" {
  for_each = toset(var.dynamodb_table_names)
  name     = each.value
}

# Glue Job 이름 변수 출력
data "external" "glue_jobs" {
  program = ["bash", "-c", "aws glue get-jobs --query '{\"result\": to_string(Jobs[*].Name)}' --output json"]
}

# Glue Crawler 이름 변수 출력
data "external" "glue_crawlers" {
  program = ["bash", "-c", "aws glue get-crawlers --query '{\"result\": to_string(Crawlers[*].Name)}' --output json"]
}

# Glue Workflow 이름 변수 출력
data "external" "glue_workflows" {
  program = ["bash", "-c", "aws glue list-workflows --query '{\"result\": to_string(Workflows)}' --output json"]
}

# Glue Catalog Database 이름 변수 출력
data "external" "glue_catalogs" {
  program = ["bash", "-c", "aws glue get-databases --query '{\"result\": to_string(DatabaseList[*].Name)}' --output json"]
}