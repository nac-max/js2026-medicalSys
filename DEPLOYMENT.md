# Production Deployment Guide

This guide explains how to deploy the MediCareAI system to production with SSL/TLS certificates and a custom domain name.

## Prerequisites

- A server with Docker and Docker Compose installed
- A registered domain name (e.g., `medicareai.example.com`)
- SSL/TLS certificate files:
  - Certificate file (e.g., `fullchain.pem` or `certificate.crt`)
  - Private key file (e.g., `privkey.pem` or `private.key`)
  - (Optional) CA bundle/chain file

## Step 1: Prepare SSL Certificate Files

1. Create a directory for SSL certificates:

```bash
mkdir -p /home/yifan/js2026-medicalSys/ssl
```

2. Copy your SSL certificate files to this directory:

```bash
# Example with Let's Encrypt certificates
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/

# Or with custom certificates
cp /path/to/your/certificate.crt ./ssl/fullchain.pem
cp /path/to/your/private.key ./ssl/privkey.pem
```

3. Set proper permissions:

```bash
chmod 600 ./ssl/privkey.pem
chmod 644 ./ssl/fullchain.pem
```

## Step 2: Update Environment Variables

1. Create or update `.env` file in the project root:

```bash
# Domain Configuration
DOMAIN_NAME=medicareai.example.com

# Backend Configuration
BACKEND_URL=https://medicareai.example.com/api
FRONTEND_URL=https://medicareai.example.com

# Database Configuration
POSTGRES_USER=medicareai_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=medicareai_db

# JWT Secret (generate a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Redis Configuration
REDIS_PASSWORD=your_redis_password_here
```

2. Generate secure secrets:

```bash
# Generate JWT secret
openssl rand -hex 32

# Generate Redis password
openssl rand -hex 16
```

## Step 3: Update docker-compose.yml

Create or update `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: medicareai-postgres
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - medicareai-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: medicareai-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - medicareai-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: medicareai-backend
    restart: always
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASSWORD: ${SMTP_PASSWORD}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - medicareai-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${BACKEND_URL}
    container_name: medicareai-frontend
    restart: always
    networks:
      - medicareai-network
    depends_on:
      - backend

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: medicareai-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - nginx_logs:/var/log/nginx
    depends_on:
      - frontend
      - backend
    networks:
      - medicareai-network
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  medicareai-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  nginx_logs:
    driver: local
```

## Step 4: Create Production Nginx Configuration

Create `nginx/nginx.prod.conf`:

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

    # Upstream backends
    upstream backend {
        server backend:8000;
        keepalive 32;
    }

    upstream frontend {
        server frontend:80;
        keepalive 32;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        listen [::]:80;
        server_name medicareai.example.com;  # Replace with your domain

        # Allow Let's Encrypt verification
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirect all other traffic to HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name medicareai.example.com;  # Replace with your domain

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        
        # SSL Security Settings
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_session_tickets off;
        
        # HSTS (optional, uncomment after testing)
        # add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Backend API
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            
            proxy_pass http://backend/;
            proxy_http_version 1.1;
            
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $server_name;
            
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
            
            proxy_buffering off;
            proxy_request_buffering off;
        }

        # Login endpoint with stricter rate limiting
        location /api/auth/login {
            limit_req zone=login_limit burst=3 nodelay;
            
            proxy_pass http://backend/auth/login;
            proxy_http_version 1.1;
            
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support (if needed)
        location /ws/ {
            proxy_pass http://backend/ws/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            proxy_read_timeout 86400;
        }

        # Frontend
        location / {
            proxy_pass http://frontend/;
            proxy_http_version 1.1;
            
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                proxy_pass http://frontend;
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## Step 5: Update Frontend Build Configuration

Update `frontend/.env.production`:

```env
VITE_API_URL=https://medicareai.example.com/api
```

## Step 6: Deploy to Production

1. **Stop any running containers:**

```bash
docker-compose down
```

2. **Build and start production containers:**

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

3. **Check container status:**

```bash
docker-compose -f docker-compose.prod.yml ps
```

4. **View logs:**

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f nginx
docker-compose -f docker-compose.prod.yml logs -f backend
```

## Step 7: Database Migration

Run database migrations:

```bash
docker-compose -f docker-compose.prod.yml exec backend python -m alembic upgrade head
```

## Step 8: Verify Deployment

1. **Check SSL certificate:**

```bash
openssl s_client -connect medicareai.example.com:443 -servername medicareai.example.com
```

2. **Test endpoints:**

```bash
# Health check
curl https://medicareai.example.com/health

# API health
curl https://medicareai.example.com/api/health

# Frontend
curl -I https://medicareai.example.com/
```

3. **Check SSL rating:**
   - Visit: https://www.ssllabs.com/ssltest/
   - Enter your domain name

## Step 9: Setup Automatic SSL Renewal (Let's Encrypt)

If using Let's Encrypt, add a certbot service to `docker-compose.prod.yml`:

```yaml
  certbot:
    image: certbot/certbot
    container_name: medicareai-certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - ./certbot-webroot:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

Create a renewal script `scripts/renew-ssl.sh`:

```bash
#!/bin/bash
docker-compose -f docker-compose.prod.yml exec certbot certbot renew
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

Add to crontab:

```bash
0 0 * * 0 /home/yifan/js2026-medicalSys/scripts/renew-ssl.sh
```

## Step 10: Monitoring and Maintenance

### View Logs

```bash
# Nginx access logs
docker-compose -f docker-compose.prod.yml exec nginx tail -f /var/log/nginx/access.log

# Nginx error logs
docker-compose -f docker-compose.prod.yml exec nginx tail -f /var/log/nginx/error.log

# Backend logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Backup Database

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U medicareai_user medicareai_db > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U medicareai_user medicareai_db < backup_20260415.sql
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend python -m alembic upgrade head
```

## Security Checklist

- [ ] SSL/TLS certificates installed and valid
- [ ] Strong passwords for database and Redis
- [ ] JWT secret is randomly generated and secure
- [ ] Firewall configured (only ports 80, 443, and SSH open)
- [ ] Rate limiting enabled in Nginx
- [ ] Security headers configured
- [ ] Database backups scheduled
- [ ] Log rotation configured
- [ ] Monitoring and alerting setup
- [ ] Regular security updates scheduled

## Troubleshooting

### SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in ./ssl/fullchain.pem -text -noout

# Test SSL connection
openssl s_client -connect medicareai.example.com:443
```

### Container Issues

```bash
# Restart specific service
docker-compose -f docker-compose.prod.yml restart nginx

# Rebuild specific service
docker-compose -f docker-compose.prod.yml up -d --build backend

# Check container health
docker inspect medicareai-nginx | grep -A 10 Health
```

### Database Connection Issues

```bash
# Test database connection
docker-compose -f docker-compose.prod.yml exec postgres psql -U medicareai_user -d medicareai_db -c "SELECT 1;"

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres
```

## Performance Optimization

1. **Enable HTTP/2 Push** (in nginx.conf):
```nginx
http2_push_preload on;
```

2. **Configure Redis caching** for API responses

3. **Setup CDN** for static assets (optional)

4. **Database connection pooling** in backend

5. **Enable Nginx caching** for static content

---

**Developed by Chang'an University (长安大学)**  
AI-Powered Medical Diagnosis System  
© 2026
