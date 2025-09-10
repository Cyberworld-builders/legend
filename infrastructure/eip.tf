# Elastic IP for the EC2 instance
resource "aws_eip" "blog_eip" {
  instance = aws_instance.blog_instance.id
  domain   = "vpc"

  tags = {
    Name        = "${var.project_name}-blog-eip"
    Environment = var.environment
    Project     = var.project_name
  }

  depends_on = [aws_instance.blog_instance]
}
