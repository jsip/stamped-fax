#############
# Variables #
#############
variable "env" {
  description = "Environment where this module will be deployed. Will be used in tags and resource names"
  default     = ""
}

variable "policy_name_suffix" {
  description = "Suffix for the name of the policy that will be created"
  default     = ""
}

variable "iam_user_name" {
  description = "Name for the IAM User that will be created by the module"
  default     = ""
}

variable "bucket_names" {
  description = "S3 bucket name for file uploads"
  default     = []
}

################
## IAM Policy ##
################
resource "aws_iam_policy" "s3_read_write_policy" {
  name        = "stamped-verify-${var.env}-${var.policy_name_suffix}-s3-rw"
  description = "Grants read and write to specified s3 buckets for stamped ${var.env} environment"

  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "VisualEditor0",
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObjectVersion",
          "s3:ListBucket",
          "s3:DeleteObject",
          "s3:PutObjectAcl"
        ],
        "Resource": flatten([for bucket in var.bucket_names : ["arn:aws:s3:::${bucket}", "arn:aws:s3:::${bucket}/*"]])
      }
    ]
  })

  tags = {
    Environment = "${var.env}"
    Terraform = "true"
  }
}

resource "aws_iam_user" "stamped_verify_iam_user" {
  name = "${var.iam_user_name}"

  tags = {
    Environment = "${var.env}"
    Terraform = "true"
  }
}

resource "aws_iam_user_policy_attachment" "s3-verify-user-attach" {
  user       = aws_iam_user.stamped_verify_iam_user.name
  policy_arn = aws_iam_policy.s3_read_write_policy.arn
}

###########
# Outputs #
###########
output "policy_id" {
  description = "The ID of the IAM policy"
  value       = aws_iam_policy.s3_read_write_policy.id
}

output "policy_arn" {
  description = "The ARN of the IAM policy"
  value       = aws_iam_policy.s3_read_write_policy.arn
}

output "policy_name" {
  description = "The name of the IAM policy"
  value       = aws_iam_policy.s3_read_write_policy.name
}

output "user_arn" {
  description = "The ARN of the IAM policy"
  value       = aws_iam_user.stamped_verify_iam_user.arn
}

output "user_name" {
  description = "The name of the IAM policy"
  value       = aws_iam_user.stamped_verify_iam_user.name
}
