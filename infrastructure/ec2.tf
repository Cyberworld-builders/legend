# Key pair for EC2 instance
resource "aws_key_pair" "blog_key" {
  key_name   = "${var.project_name}-blog-key"
  public_key = file("~/.ssh/id_rsa.pub") # You'll need to generate this key pair

  tags = {
    Name        = "${var.project_name}-blog-key"
    Environment = var.environment
    Project     = var.project_name
  }
}

# EC2 instance
resource "aws_instance" "blog_instance" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name              = aws_key_pair.blog_key.key_name
  vpc_security_group_ids = [aws_security_group.blog_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  subnet_id             = data.aws_subnets.default.ids[0]

  # User data script to install and configure the blog
  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    project_name = var.project_name
    s3_bucket    = aws_s3_bucket.media_bucket.bucket
    cloudfront_domain = aws_cloudfront_distribution.media_cdn.domain_name
  }))

  root_block_device {
    volume_type = "gp3"
    volume_size = 20
    encrypted   = true

    tags = {
      Name        = "${var.project_name}-blog-root-volume"
      Environment = var.environment
      Project     = var.project_name
    }
  }

  tags = {
    Name        = "${var.project_name}-blog-instance"
    Environment = var.environment
    Project     = var.project_name
  }
}
