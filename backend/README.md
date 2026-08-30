# Personal Finance Management (PFM) Dashboard - Backend

Backend REST API for the Personal Finance Management Dashboard. The backend provides authentication, Plaid integration, account management, transaction management, dashboard analytics and budgeting functionality.

## Features

- User Registration & Login
- JWT Authentication
- Password Hashing
- Email Validation
- Password Validation
- Plaid Sandbox Integration
- Bank Account Management
- Transaction Management
- Income Management
- Expense Management
- Budget Management
- Dashboard Summary
- Monthly Financial Summary
- Expense Category Breakdown
- Recent Transactions
- Protected API Routes
- MongoDB Database

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Validator
- Plaid API
- CORS
- dotenv
- Nodemon

## Project Structure

backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── plaidController.js
│   ├── accountController.js
│   ├── transactionController.js
│   ├── dashboardController.js
│   └── budgetController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── user.js
│   ├── account.js
│   ├── transaction.js
│   └── budget.js
├── routes/
│   ├── authRoutes.js
│   ├── plaidRoutes.js
│   ├── accountRoutes.js
│   ├── transactionRoutes.js
│   ├── dashboardRoutes.js
│   └── budgetRoutes.js
├── .env
├── package.json
├── server.js
└── README.md

## Architecture

Client / Frontend
        ↓
      Routes
        ↓
    Middleware
        ↓
    Controllers
        ↓
      Models
        ↓
     MongoDB

## Authentication APIs

Register:

POST /api/auth/register

Login:

POST /api/auth/login

Protected APIs require:

Authorization: Bearer <JWT_TOKEN>

JWT authentication is used to identify and protect user-specific data.

## Plaid APIs

Create Link Token:

POST /api/plaid/create-link-token

Exchange Public Token:

POST /api/plaid/exchange-token

The project uses Plaid Sandbox for development and testing.

## Accounts API

Get Accounts:

GET /api/accounts

Accounts can contain:

- Account Name
- Account Type
- Bank Name
- Balance
- Plaid Account ID

Account types:

- bank
- credit_card
- investment

## Transactions APIs

Get Transactions:

GET /api/transactions

Add Transaction:

POST /api/transactions

Update Transaction:

PUT /api/transactions/:id

Delete Transaction:

DELETE /api/transactions/:id

Transaction types:

- income
- expense
- investment

Transactions contain amount, category, merchant name, description, date and account information.

## Dashboard APIs

Dashboard Summary:

GET /api/dashboard/summary

Monthly Summary:

GET /api/dashboard/monthly-summary

Expense Breakdown:

GET /api/dashboard/expense-by-category

Recent Transactions:

GET /api/dashboard/recent-transactions

## Budget APIs

Budget functionality is available under:

/api/budgets

The budget API allows users to create, view, update and delete budgets.

## Database Models

User:

- name
- email
- password
- plaidAccessToken
- plaidItemId

Account:

- user
- accountName
- accountType
- bankName
- balance
- plaidAccountId

Transaction:

- user
- account
- amount
- type
- category
- merchantName
- description
- date
- plaidTransactionId

Budget:

- User budget information

## Environment Variables

Create a .env file:

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=your_token_expiration
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

Never commit the .env file to GitHub.

## Installation

1. Open the backend folder:

cd backend

2. Install dependencies:

npm install

3. Configure the .env file.

4. Start the backend:

nodemon server.js

The backend runs on:

http://localhost:4000

## API Base URL

http://localhost:4000/api


## Security

- Passwords are hashed using bcryptjs
- JWT authentication protects private APIs
- Email validation is implemented
- Password validation is implemented
- Sensitive credentials are stored in environment variables
- User-specific data is protected using authentication

## Deployment

The backend can be deployed using Render.

MongoDB can be hosted using MongoDB Atlas.


## Project

Personal Finance Management (PFM) Dashboard

A full-stack personal finance application built using React.js, Node.js, Express.js, MongoDB, Mongoose, JWT and Plaid.