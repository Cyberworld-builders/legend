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

# Install nginx
apt-get install -y nginx

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

# Configure nginx as reverse proxy
cat > /etc/nginx/sites-available/${project_name} << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/${project_name} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t
systemctl reload nginx
systemctl enable nginx

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
                        "file_path": "/var/log/nginx/access.log",
                        "log_group_name": "/aws/ec2/${project_name}/nginx/access",
                        "log_stream_name": "{instance_id}"
                    },
                    {
                        "file_path": "/var/log/nginx/error.log",
                        "log_group_name": "/aws/ec2/${project_name}/nginx/error",
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
