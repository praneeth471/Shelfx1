# ShelfX - Book Rental and Sales Platform

ShelfX is a dynamic platform designed to connect book enthusiasts for renting and selling books. It empowers users to upload, rent, and purchase books seamlessly.Through this website seller and buyer can contact each other.

## Features

- **Book Management**: Sellers can upload books for sale or rent.
- **Request Handling**: Buyers can request books from sellers, with options to accept or decline requests.
- **User Authentication**: Secure login for sellers, buyers, and admins.
- **Responsive Design**: Mobile-friendly UI for smooth user experience.

---

## Tech Stack

- **Frontend**: ReactJS, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Languages**: JavaScript

---

## Installation

### Prerequisites
Ensure the following are installed:
- Node.js (v16+)
- MySQL
- Git

### Steps to run 

1. **Clone the repository**
   ```bash
   git clone https://github.com/Neeraj3737/ShelfX.git
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

## Stopping the Application

To stop the containers:

```bash
docker-compose down
```

To stop and remove volumes (this will delete the database data):

```bash
docker-compose down -v
```


