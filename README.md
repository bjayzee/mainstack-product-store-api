
# Product Management API

A RESTful API for managing products, built with Node.js, Express, Typescript and MongoDB. This API allows users to create, read, update, and delete products, with built-in validation and error handling.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- Create a new product
- Fetch all products
- Fetch products with pagination
- Update product details
- Delete a product
- User registration
- User login
- Token based authentication

## Technologies Used
- **Node.js**: JavaScript runtime for server-side programming
- **Express**: Web framework for building RESTful APIs
- **MongoDB**: NoSQL database for storing product data
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js
- **Joi**: Schema description language and data validator for JavaScript
- **TypeScript**: Typed superset of JavaScript for better development experience
- **http-status**: For HTTP status code constants
-  **bcryptjs**: For encryption and decryption
-   **jwtwebtoken**: For token generation

## Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:bjayzee/mainstack-product-store-api.git

  cd mainstack
  npm install

npm run dev
