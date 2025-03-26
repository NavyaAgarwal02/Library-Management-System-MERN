# Library Management System (MERN Stack)

Welcome to the Library Management System, a full-stack application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with TypeScript, Redux for state management, Tailwind CSS with DaisyUI for styling, Prisma for the database client, and Zod for validation.

## Features

- **User Authentication**: Secure login and registration using JSON Web Tokens (JWT).
- **Book Management**: CRUD operations for managing books, including search and filtering capabilities.
- **User Management**: User profiles, account settings, and role-based access control (RBAC).
- **Dashboard**: Visual representation of library statistics and user activity.
- **API Integration**: RESTful APIs for seamless communication between frontend and backend.

## Technologies Used

### Backend

- **Node.js with Express.js**: Backend server and API development.
- **MongoDB**: NoSQL database for storing book and user information.
- **Prisma**: Database client for TypeScript and Node.js, providing type-safe database access.
- **JWT**: Authentication and authorization mechanism.
- **RESTful APIs**: Designed using Express.js for handling CRUD operations.

### Frontend

- **React.js with TypeScript**: Frontend UI components and logic.
- **Redux**: State management for handling complex application states.
- **Axios**: HTTP client for making API requests to the backend.
- **React Router**: Navigation and routing within the single-page application.
- **Tailwind CSS with DaisyUI**: Utility-first CSS framework for responsive and modern UI design.

### Validation

- **Zod**: TypeScript-first schema validation library for type-safe validation.

### Deployment

- **Deployment Platforms**: Heroku, AWS, Azure, or any other cloud service for hosting.

## Getting Started

### Prerequisites

- **Node.js**: Make sure Node.js is installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/T-Naveen-2308/Library-Management-System-MERN.git
   cd Library-Management-System-MERN
   ```
2. **Install dependencies for both backend and frontend:**

    ```bash
    Copy code
    # Install backend dependencies
    cd backend
    npm install
    # Install frontend dependencies
    cd ../frontend
    npm install
    ```
    
3. **Configure environment variables:**

    Create .env files in both backend and frontend directories for environment-specific configurations (e.g., MongoDB connection URI, JWT secret).
   
4. **Start the backend server:**

```bash
Copy code
# From the backend directory
npm start
```

5. **Start the frontend development server:**

```bash
Copy code
# From the frontend directory
npm start
```

6. **Open your browser and visit http://localhost:3000 to view the application.**

## Folder Structure
```
├── backend/             # Backend Node.js/Express application  
│   ├── controllers/     # Route controllers  
│   ├── models/          # Database models  
│   ├── routes/          # API routes  
│   ├── config/          # Configuration files  
│   └── server.js        # Express application entry point  
├── frontend/            # Frontend React.js application  
│   ├── public/          # Public assets  
│   ├── src/             # Source code  
│   ├── components/      # React components  
│   ├── pages/           # Application pages  
│   ├── store/           # Redux store configuration  
└── ├── App.js           # Main React application component  
```
