variable "vpc_name" {
  description = "The name of the VPC to retrieve"
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

variable "s3_bucket_names" {
  description = "List of S3 bucket names"
  type        = list(string)
  default     = [
    "ankimozzi-questions",
    "ankkimozzi-text-extracted",
    "ankkimozzi-text-processed",
    "ankkimozzi-video",
    "aws-glue-assets-851725378421-us-west-1"
  ]
}

variable "dynamodb_table_names" {
  description = "List of DynamoDB table names"
  type        = list(string)
  default     = ["Ankkimozzi2"]
}

variable "glue_job_names" {
  description = "List of Glue Job names"
  type        = list(string)
  default     = ["ang"]
}

variable "glue_crawler_names" {
  description = "List of Glue Crawler names"
  type        = list(string)
  default     = ["ank3"]
}

variable "glue_workflow_names" {
  description = "List of Glue Workflow names"
  type        = list(string)
  default     = ["anki"]
}

variable "glue_catalog_names" {
  description = "List of Glue Catalog Database names"
  type        = list(string)
  default     = ["ankimozzi_questions"]
} 