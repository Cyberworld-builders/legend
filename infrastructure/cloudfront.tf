# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "media_oac" {
  name                              = "${var.project_name}-media-oac"
  description                       = "OAC for ${var.project_name} media bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront distribution for media CDN
resource "aws_cloudfront_distribution" "media_cdn" {
  origin {
    domain_name              = aws_s3_bucket.media_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.media_oac.id
    origin_id                = "S3-${aws_s3_bucket.media_bucket.bucket}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for ${var.project_name} media"
  default_root_object = "index.html"

  # Custom domain (if provided)
  dynamic "aliases" {
    for_each = var.domain_name != "" ? [var.domain_name] : []
    content {
      aliases = [var.domain_name]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.media_bucket.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # Cache behavior for images
  ordered_cache_behavior {
    path_pattern     = "images/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.media_bucket.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }

  # Cache behavior for audio
  ordered_cache_behavior {
    path_pattern     = "audio/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.media_bucket.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }

  # Cache behavior for video
  ordered_cache_behavior {
    path_pattern     = "video/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.media_bucket.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "${var.project_name}-media-cdn"
    Environment = var.environment
    Project     = var.project_name
  }
}
