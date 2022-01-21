provider "aws" {
  region = "us-east-1"
  profile = "integration"
}

terraform {
  backend "s3" {
    bucket = "stampedai-terraform-integration"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}

locals {
  env = "integration"
}

################
## Cloudfront ##
################
module "cdn" {
  source = "../../terraform_modules/cloudfront_distribution"

  env = local.env
  domain_name = "integration.stamped.ai"
}

#########
## IAM ##
#########
resource "aws_iam_user" "ci_user" {
  name = "github-action-ci-${local.env}"

  tags = {
    Environment = "${local.env}"
    Terraform = "true"
  }
}

resource "aws_iam_user_policy_attachment" "ci_user_admin_policy_attachment" {
  user       = aws_iam_user.ci_user.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
