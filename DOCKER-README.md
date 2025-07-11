# ShelfX Docker Setup

This document provides instructions for running the ShelfX application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sailesh3000/shelfx.git
   cd shelfx
   ```

2. **Build and start the containers**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: https://localhost:5000
   - Swagger API Documentation: https://localhost:5000/api-docs

## Environment Variables

The application uses environment variables defined in the `.env` file. Make sure this file exists with the following variables:

```
EMAIL_USR=your-email@example.com
APP_PASS=your-app-password
CLOUD_NAME=your-cloudinary-name
API_KEY=your-api-key
API_SECRET=your-api-secret
```

## Services

- **Frontend**: React application served by Nginx
- **Backend**: Node.js/Express.js API
- **Database**: MySQL 8.0

## Stopping the Application

To stop the containers:

```bash
docker-compose down
```

To stop and remove volumes (this will delete the database data):

```bash
docker-compose down -v
```

## Troubleshooting

- **Database Connection Issues**: Ensure the MySQL container is running and the connection settings in the backend match those in the docker-compose.yml file.
- **Container Logs**: View logs with `docker-compose logs [service_name]`