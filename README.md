# Ali's Authenticated Backend

Welcome to Ali's Authenticated Backend repository! This backend system, built with Node.js, Express.js, and Prisma, features a robust authentication system to secure your applications.

## Features

- **Authentication System**: Secure user authentication with JSON Web Tokens (JWT).
- **Prisma Integration**: Utilizes Prisma for ORM and database operations.
- **RESTful API**: Implements a RESTful API architecture for easy integration with frontend applications.
- **Scalable Architecture**: Built with scalability and maintainability in mind using Node.js and Express.js best practices.

## Technologies Used

- Node.js
- Express.js
- Prisma
- JSON Web Tokens (JWT)
- Docker (optional, for local development)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js installed locally
- Docker (if applicable for database setup)

### Installation

1. Clone the repository.

2. Install dependencies using yarn:

    ```bash
    yarn install

3. Set up your environment variables. Create a .env file in the root directory with the following variables:

    ```bash
    JWT_SECRET_ACCESS =00000000-0000-0000-0000-00000000000
    JWT_SECRET_RENEW =00000000-0000-0000-0000-00000000000
    API_SECRET_KEY =00000000-0000-0000-0000-00000000000

    ACCESS_TOKEN_LIFESPAN=1800  
    RENEW_TOKEN_LIFESPAN=86400  
    DB_SOURCE=mysql
    DB_USERNAME=root
    DB_PASSWORD=root
    DB_HOST=host-name
    DB_PORT=3306
    DB_NAME=db-name

    DATABASE_URL=${DB_SOURCE}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

4. Run database migrations with Prisma:

    ```bash
    yarn run migrate

5. Start the server:

    ```bash
    yarn start

## usefull dependencies for this system

1- @prisma/client: Prisma is an ORM (Object-Relational Mapping) tool for databases. It generates TypeScript/JavaScript code to interact with your database, making it easier to manage database queries and models.

2- @types/multer: This package provides TypeScript type definitions for the popular file upload middleware Multer. It helps handle file uploads in Express applications.

3- axios: A widely-used HTTP client for making requests to APIs or servers. It simplifies handling asynchronous requests and responses.

4- bcrypt: A library for hashing and salting passwords. It’s commonly used for securely storing user passwords in databases.

5- cors: Middleware for Cross-Origin Resource Sharing. It enables or restricts access to resources on a web page from different domains.

6- dotenv: A utility for loading environment variables from a .env file. Useful for managing configuration settings in your app.

7- express: A popular web application framework for Node.js. It simplifies building APIs, handling routes, and middleware.

8- express-rate-limit: Middleware to limit the rate of incoming requests to prevent abuse or DoS attacks.

9- handlebars: A templating engine that allows you to create dynamic HTML templates. Useful for rendering views in Express.

10- jsonwebtoken: A library for creating and verifying JSON Web Tokens (JWT). Commonly used for authentication and authorization.

11- multer: Middleware for handling file uploads in Express. It supports various storage options (e.g., disk storage, memory, S3).

12- node-cron: A package for scheduling cron jobs in Node.js. Useful for running tasks at specific intervals.

13- nodemailer: A library for sending email from Node.js applications. It simplifies email handling and supports various transports (SMTP, SendGrid, etc.).

14- pino: A fast and lightweight logging library for Node.js. It’s efficient and suitable for production use.

15- pino-pretty: A CLI tool for formatting Pino logs in a human-readable way during development.

16- prisma: The Prisma CLI for database migrations, schema management, and data modeling.

17- request-progress: A package for tracking the progress of HTTP requests. Useful for showing download/upload progress.

18- sanitize-filename: A utility for sanitizing file names to prevent issues with special characters or invalid paths.

19- save: A package manager command for saving dependencies to your package.json.

20- save-dev: Similar to save, but for development dependencies (used during development, not in production).
