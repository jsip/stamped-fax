#####################
# Cloudfront module #
#####################
output "cdn_id" {
  description = "The ID of the CloudFront distribution"
  value       = module.cdn.id
}

output "cdn_arn" {
  description = "The ARN of the CloudFront distribution"
  value       = module.cdn.arn
}

output "cdn_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = module.cdn.domain_name
}

##############
# IAM module #
##############
output "s3_policy_id" {
  description = "The ID of the IAM policy"
  value       = module.app_iam_user.policy_id
}

output "s3_policy_arn" {
  description = "The ARN of the IAM policy_arn"
  value       = module.app_iam_user.policy_arn
}

output "s3_policy_name" {
  description = "The name of the IAM policy_name"
  value       = module.app_iam_user.policy_name
}

output "app_user_arn" {
  description = "The ARN of the IAM user_arn"
  value       = module.app_iam_user.user_arn
}

output "app_user_name" {
  description = "The name of the IAM user_name"
  value       = module.app_iam_user.user_name
}

output "ai_s3_policy_id" {
  description = "The ID of the IAM ai policy"
  value       = module.ai_iam_user.policy_id
}

output "ai_s3_policy_arn" {
  description = "The ARN of the IAM ai policy_arn"
  value       = module.ai_iam_user.policy_arn
}

output "ai_s3_policy_name" {
  description = "The name of the IAM ai policy_name"
  value       = module.ai_iam_user.policy_name
}

output "ai_user_arn" {
  description = "The ARN of the IAM ai user_arn"
  value       = module.ai_iam_user.user_arn
}

output "ai_user_name" {
  description = "The name of the IAM ai user_name"
  value       = module.ai_iam_user.user_name
}

output "ci_user_arn" {
  description = "The ARN of the IAM ci user"
  value       = aws_iam_user.ci_user.arn
}

output "ci_user_name" {
  description = "The name of the IAM ci user"
  value       = aws_iam_user.ci_user.name
}
