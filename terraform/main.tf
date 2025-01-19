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

# 기존 VPC의 서브넷 가져오기
data "aws_subnet_ids" "selected_subnets" {
  vpc_id = data.aws_vpc.selected_vpc.id
}

data "aws_subnet" "subnets" {
  for_each = toset(data.aws_subnet_ids.selected_subnets.ids)
  id       = each.value
}

# EKS 클러스터 생성
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "ankimozzi-cluster"
  cluster_version = "1.24"
  vpc_id          = data.aws_vpc.selected_vpc.id
  subnets         = data.aws_subnet_ids.selected_subnets.ids

  node_groups = {
    eks_nodes = {
      desired_capacity = 2
      max_size         = 3
      min_size         = 1
      instance_type    = "t3.medium"
    }
  }

  tags = {
    Environment = "Production"
    Project     = "Ankimozzi"
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

# API Gateway 가져오기
data "aws_api_gateway_rest_api" "existing_api" {
  name = "Ankimozzi"
}

data "aws_api_gateway_resource" "existing_resource" {
  rest_api_id = data.aws_api_gateway_rest_api.existing_api.id
  path        = "/"
}

# Glue 리소스 가져오기 (AWS CLI 사용)
data "external" "glue_resources" {
  program = ["bash", "-c", <<-EOT
    jobs=$(aws glue get-jobs --query "Jobs[?Name==\\\`ang\\\`].{name:Name,arn:Role}" --output json || echo "[]")
    crawlers=$(aws glue get-crawlers --query "Crawlers[?Name==\\\`ank3\\\`].{name:Name,role:Role}" --output json || echo "[]")
    workflows=$(aws glue get-workflows --query "Workflows[?Name==\\\`anki\\\`].Name" --output json || echo "[]")
    databases=$(aws glue get-databases --query "DatabaseList[?Name==\\\`ankimozzi_questions\\\`].Name" --output json || echo "[]")
    echo "{\"jobs\":\"$jobs\",\"crawlers\":\"$crawlers\",\"workflows\":\"$workflows\",\"databases\":\"$databases\"}"
  EOT
  ]
}