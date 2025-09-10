output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.blog_instance.id
}

output "ec2_instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.blog_eip.public_ip
}

output "ec2_instance_private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.blog_instance.private_ip
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for media storage"
  value       = aws_s3_bucket.media_bucket.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.media_bucket.arn
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.media_cdn.id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.media_cdn.domain_name
}

output "cloudfront_url" {
  description = "URL of the CloudFront distribution"
  value       = "https://${aws_cloudfront_distribution.media_cdn.domain_name}"
}

output "iam_role_arn" {
  description = "ARN of the IAM role for the EC2 instance"
  value       = aws_iam_role.ec2_role.arn
}

output "iam_instance_profile_name" {
  description = "Name of the IAM instance profile"
  value       = aws_iam_instance_profile.ec2_profile.name
}

output "traefik_dashboard_url" {
  description = "URL to access the Traefik dashboard"
  value       = "http://${aws_eip.blog_eip.public_ip}:8080"
}

output "blog_url" {
  description = "URL to access the blog"
  value       = "http://${aws_eip.blog_eip.public_ip}"
}

output "ssh_connection_command" {
  description = "SSH command to connect to the EC2 instance"
  value       = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_eip.blog_eip.public_ip}"
}