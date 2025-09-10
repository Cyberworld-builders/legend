# Legend Blog Infrastructure

This Terraform configuration sets up AWS infrastructure for hosting a self-hosted blog with the following components:

## Infrastructure Components

- **EC2 Instance**: Ubuntu 22.04 LTS with t3.micro instance type
- **IAM Role & Instance Profile**: For EC2 to access AWS services
- **S3 Bucket**: For media storage (images, audio, video)
- **CloudFront CDN**: For fast global content delivery
- **Elastic IP**: Static IP address for the EC2 instance
- **Traefik**: Reverse proxy and load balancer (replaces nginx)
- **Security Groups**: Configured for HTTP, HTTPS, SSH, and Traefik dashboard access

## Prerequisites

1. **AWS CLI configured** with appropriate credentials
2. **Terraform installed** (version >= 1.0)
3. **SSH key pair** generated and available at `~/.ssh/id_rsa.pub`

## Quick Start

1. **Copy and customize variables**:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your preferred settings
   ```

2. **Initialize Terraform**:
   ```bash
   terraform init
   ```

3. **Plan the deployment**:
   ```bash
   terraform plan
   ```

4. **Deploy the infrastructure**:
   ```bash
   terraform apply
   ```

5. **Access your services**:
   - Blog: `http://<EIP_ADDRESS>`
   - Traefik Dashboard: `http://<EIP_ADDRESS>:8080`
   - SSH: `ssh -i ~/.ssh/id_rsa ubuntu@<EIP_ADDRESS>`

## Configuration Details

### Traefik Configuration

Traefik is configured with:
- Dashboard enabled on port 8080
- HTTP entry point on port 80
- HTTPS entry point on port 443 (ready for SSL certificates)
- File-based dynamic configuration
- Let's Encrypt integration for automatic SSL certificates

### S3 and CloudFront

- S3 bucket with versioning and encryption enabled
- CloudFront distribution with optimized caching for different media types
- Origin Access Control (OAC) for secure S3 access
- CORS configuration for web access

### Security

- Security group allows HTTP (80), HTTPS (443), SSH (22), and Traefik dashboard (8080)
- IAM role with minimal required permissions
- S3 bucket with public access blocked
- CloudWatch logging enabled

## Post-Deployment

After deployment, you'll need to:

1. **Deploy your application** to the EC2 instance
2. **Configure DNS** (if using a custom domain)
3. **Set up SSL certificates** via Let's Encrypt
4. **Restrict security group access** to your specific IP ranges

## Monitoring

CloudWatch agent is installed and configured to collect:
- System metrics (CPU, memory, disk)
- Application logs
- Traefik access and error logs

## Cost Optimization

- Uses t3.micro instance (eligible for free tier)
- CloudFront with PriceClass_100 (cheapest option)
- S3 with standard storage class

## Cleanup

To destroy all resources:
```bash
terraform destroy
```

## Important Notes

- The Traefik dashboard is accessible on port 8080 - restrict access in production
- SSH access is open to all IPs by default - restrict in production
- The EC2 instance has an IAM role attached for S3 access
- All resources are tagged for easy identification and cost tracking
