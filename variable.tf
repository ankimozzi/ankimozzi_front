# VPC 이름
variable "vpc_name" {
  description = "The name of the VPC to retrieve."
  default     = "Ankimozzi-vpc"
}

variable "lambda_names" {
  description = "List of Lambda function names"
  type        = list(string)
  default     = [
    "s3-to-bedrock",
    "S3-to-Transcribe",
    "Text_transform",
    "Gluetest"
  ]
}
# Lambda 함수 ARN
variable "lambda_arns" {
  description = "List of Lambda function ARNs"
  type        = list(string)
  default     = [
    "arn:aws:lambda:us-west-1:851725378421:function:s3-to-bedrock",
    "arn:aws:lambda:us-west-1:851725378421:function:S3-to-Transcribe",
    "arn:aws:lambda:us-west-1:851725378421:function:Text_transform",
    "arn:aws:lambda:us-west-1:851725378421:function:Gluetest"
  ]
}

# S3 버킷 이름
variable "s3_bucket_names" {
  description = "List of S3 bucket names."
  default = [
    "ankimozzi-questions",
    "ankkimozzi-text-extracted",
    "ankkimozzi-text-processed",
    "ankkimozzi-video"
  ]
}

# DynamoDB 테이블 이름
variable "dynamodb_table_names" {
  description = "List of DynamoDB table names."
  default = [
    "Ankkimozzi2"
  ]
}

# Glue Job 이름
variable "glue_job_names" {
  description = "List of Glue Job names."
  default = [
    "ang"
  ]
}

# Glue Crawler 이름
variable "glue_crawler_names" {
  description = "List of Glue Crawler names."
  default = [
    "ank3"
  ]
}

# Glue Workflow 이름
variable "glue_workflow_names" {
  description = "List of Glue Workflow names."
  default = [
    "anki"
  ]
}

# Glue Catalog Database 이름
variable "glue_catalog_names" {
  description = "List of Glue Catalog Database names."
  default = [
    "ankimozzi_questions"
  ]
}