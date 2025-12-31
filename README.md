# Micro-Posting Website API

Welcome to the Micro-Posting Website API project! This is a backend application built with **NestJS**, designed to provide a robust API for a micro-blogging platform.

## 🚀 Features

- **User Authentication**: Secure sign-up and login using JWT (JSON Web Tokens).
- **User Management**: Manage user profiles.
- **Micro-Blogging**: Create, read, update, and delete posts.
- **API Documentation**: Integrated Swagger UI for interactive API exploration.
- **Data Validation**: Request payload validation using DTOs.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Sequelize (via `@nestjs/sequelize`)
- **Authentication**: Passport.js & JWT
- **Documentation**: Swagger (OpenAPI)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18 or later recommended)
- **npm** (Node Package Manager)
- **MySQL Database**

## ⚙️ Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd micro-posting-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory based on the provided `.env.example`.
    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your database credentials and configuration:

    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_DATABASE=micro_posting
    JWT_SECRET=your_super_secret_key
    PORT=3000
    ```

    > **Note:** Make sure the MySQL database (`micro_posting` by default) exists before starting the application, or ensure Sequelize is configured to create it.

## 🏃 Running the Application

### Development Mode
To start the application in development mode with hot-reloading:

```bash
npm run start:dev
```

### Production Mode
To build and start the application for production:

```bash
npm run build
npm run start:prod
```

The server will typically start on `http://localhost:3000` (or the port specified in your `.env`).

## 📚 API Documentation

Once the application is running, you can access the Swagger UI documentation at:

**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

This interface allows you to view all available endpoints, schemas, and test requests directly from your browser.

## 🧪 Testing

The project includes unit and e2e tests.

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📂 Project Structure

```
src/
├── auth/           # Authentication module (strategies, guards, controllers)
├── common/         # Shared resources (decorators, filters, etc.)
├── posts/          # Posts module (CRUD for posts)
├── users/          # Users module (User management)
├── app.module.ts   # Main application module
└── main.ts         # Application entry point
```

## 📄 License

This project is [UNLICENSED](LICENSE).
