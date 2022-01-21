#############
# Variables #
#############
variable "env" {
  description = "Environment where this module will be deployed. Will be used in tags and resource names"
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the CloudFront Distribution' origin"
  default     = ""
}

#############
# Resources #
#############
resource "aws_cloudfront_distribution" "distribution" {
  origin {
    domain_name = var.domain_name
    origin_id   = "railscdn-${var.domain_name}"

    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled = true
  is_ipv6_enabled = true
  price_class = "PriceClass_100"

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/packs/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "railscdn-${var.domain_name}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }

      headers = ["Origin"]
    }

    viewer_protocol_policy = "redirect-to-https"
    compress = true

    # The following TTL values must not change
    # See https://github.com/hashicorp/terraform-provider-aws/issues/19382
    default_ttl = 86400
    min_ttl = 0
    max_ttl = 31536000
  }

  # Cache behavior with precedence 1
  ordered_cache_behavior {
    path_pattern     = "/assets/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "railscdn-${var.domain_name}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }

      headers = ["Origin"]
    }

    viewer_protocol_policy = "redirect-to-https"
    compress = true

    # The following TTL values must not change
    # See https://github.com/hashicorp/terraform-provider-aws/issues/19382
    default_ttl = 86400
    min_ttl = 0
    max_ttl = 31536000
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "railscdn-${var.domain_name}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }

      headers = ["Origin"]
    }

    trusted_signers = ["self"]
    viewer_protocol_policy = "redirect-to-https"
    compress = true

    # The following TTL values must not change
    # See https://github.com/hashicorp/terraform-provider-aws/issues/19382
    default_ttl = 86400
    min_ttl = 0
    max_ttl = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = "${var.env}"
    Terraform = "true"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

###########
# Outputs #
###########
output "id" {
  description = "The ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.distribution.id
}

output "arn" {
  description = "The ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.distribution.arn
}

output "domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.distribution.domain_name
}