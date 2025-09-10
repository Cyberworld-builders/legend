#!/bin/bash

# Update system
apt-get update
apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ubuntu

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install Traefik
curl -fsSL https://github.com/traefik/traefik/releases/latest/download/traefik_v2.10.7_linux_amd64.tar.gz -o traefik.tar.gz
tar -xzf traefik.tar.gz
mv traefik /usr/local/bin/
chmod +x /usr/local/bin/traefik
rm traefik.tar.gz

# Create application directory
mkdir -p /home/ubuntu/app
chown ubuntu:ubuntu /home/ubuntu/app

# Create environment file for the application
cat > /home/ubuntu/app/.env << EOF
# AWS Configuration
AWS_REGION=${aws_region}
S3_BUCKET=${s3_bucket}
CLOUDFRONT_DOMAIN=${cloudfront_domain}

# Application Configuration
NODE_ENV=production
PORT=3000
EOF

# Create Traefik configuration directory
mkdir -p /etc/traefik

# Create Traefik log directory
mkdir -p /var/log/traefik

# Configure Traefik
cat > /etc/traefik/traefik.yml << EOF
api:
  dashboard: true
  insecure: true

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  file:
    filename: /etc/traefik/dynamic.yml
    watch: true

log:
  level: INFO
  filePath: "/var/log/traefik/traefik.log"

accessLog:
  filePath: "/var/log/traefik/access.log"

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@${project_name}.com
      storage: /etc/traefik/acme.json
      httpChallenge:
        entryPoint: web
EOF

# Create dynamic configuration for Traefik
cat > /etc/traefik/dynamic.yml << EOF
http:
  routers:
    blog:
      rule: "Host(\`\`)"
      service: blog-service
      entryPoints:
        - web

  services:
    blog-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3000"
EOF

# Create Traefik systemd service
cat > /etc/systemd/system/traefik.service << EOF
[Unit]
Description=Traefik HTTP reverse proxy and load balancer
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/traefik --configfile=/etc/traefik/traefik.yml
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create acme.json file for Let's Encrypt certificates
touch /etc/traefik/acme.json
chmod 600 /etc/traefik/acme.json

# Enable and start Traefik
systemctl daemon-reload
systemctl enable traefik
systemctl start traefik

# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i -E ./amazon-cloudwatch-agent.deb

# Create CloudWatch agent configuration
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << EOF
{
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/traefik/access.log",
                        "log_group_name": "/aws/ec2/${project_name}/traefik/access",
                        "log_stream_name": "{instance_id}"
                    },
                    {
                        "file_path": "/var/log/traefik/error.log",
                        "log_group_name": "/aws/ec2/${project_name}/traefik/error",
                        "log_stream_name": "{instance_id}"
                    }
                ]
            }
        }
    },
    "metrics": {
        "namespace": "CWAgent",
        "metrics_collected": {
            "cpu": {
                "measurement": [
                    "cpu_usage_idle",
                    "cpu_usage_iowait",
                    "cpu_usage_user",
                    "cpu_usage_system"
                ],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": [
                    "used_percent"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "diskio": {
                "measurement": [
                    "io_time"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "mem": {
                "measurement": [
                    "mem_used_percent"
                ],
                "metrics_collection_interval": 60
            }
        }
    }
}
EOF

# Start CloudWatch agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
    -s

# Create startup script
cat > /home/ubuntu/start-app.sh << 'EOF'
#!/bin/bash
cd /home/ubuntu/app
# Add your application startup commands here
# For example:
# docker-compose up -d
# or
# npm start
EOF

chmod +x /home/ubuntu/start-app.sh
chown ubuntu:ubuntu /home/ubuntu/start-app.sh

# Create systemd service for the application
cat > /etc/systemd/system/${project_name}.service << EOF
[Unit]
Description=${project_name} Blog Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/app
ExecStart=/home/ubuntu/start-app.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ${project_name}

# Clean up
rm -f get-docker.sh awscliv2.zip
rm -rf aws/

echo "Setup completed successfully!"
