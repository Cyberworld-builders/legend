# S3 bucket for media storage
resource "aws_s3_bucket" "media_bucket" {
  bucket = "${var.project_name}-media-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "${var.project_name}-media-bucket"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Random ID for bucket suffix to ensure uniqueness
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# S3 bucket versioning
resource "aws_s3_bucket_versioning" "media_bucket_versioning" {
  bucket = aws_s3_bucket.media_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 bucket server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "media_bucket_encryption" {
  bucket = aws_s3_bucket.media_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 bucket public access block
resource "aws_s3_bucket_public_access_block" "media_bucket_pab" {
  bucket = aws_s3_bucket.media_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 bucket CORS configuration for web access
resource "aws_s3_bucket_cors_configuration" "media_bucket_cors" {
  bucket = aws_s3_bucket.media_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# S3 bucket policy for CloudFront access
resource "aws_s3_bucket_policy" "media_bucket_policy" {
  bucket = aws_s3_bucket.media_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.media_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.media_cdn.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_cloudfront_distribution.media_cdn]
}
