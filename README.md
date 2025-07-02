# Visa Application Backend

A NestJS-based REST API for managing visa applications with user authentication and role-based access control.

## Features

- 🔐 JWT-based authentication
- 👥 Role-based authorization (User/Admin)
- 📝 Visa application management
- 🗄️ MongoDB database integration
- ✅ Input validation and sanitization
- 🔒 Password encryption with bcrypt
- 🌐 CORS enabled

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **MongoDB** (local installation or MongoDB Atlas)

## Environment Setup

1. **Clone the repository**

   ```bash
   git clone <your-repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory:

   ```bash
   # Database
   MONGODB_URI=mongodb://localhost:27017/visa-applications
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/visa-applications

   # JWT Secret (generate a strong secret)
   JWT_SECRET=your-super-secret-jwt-key-here

   # Server Port (optional, defaults to 3001)
   PORT=3001
   ```

## Running the Application

### Development Mode

```bash
# Start in development mode with hot reload
pnpm run start:dev
# or
npm run start:dev
```

### Production Mode

```bash
# Build the application
pnpm run build

# Start in production mode
pnpm run start:prod
```

### Debug Mode

```bash
# Start with debugging enabled
pnpm run start:debug
```

## API Documentation

The API runs on `http://localhost:3001` (or the port specified in your `.env` file).

### Base URL

```
http://localhost:3001
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Available Endpoints

#### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login

#### Users (Admin Only)

- `POST /users/admin` - Create admin user

#### Applications

- `GET /applications` - Get user's applications
- `POST /applications` - Submit new application

#### Admin Endpoints

- `GET /admin/applications` - Get all applications (Admin only)

For detailed API documentation, see [API_SCHEMA.md](./API_SCHEMA.md).

## Testing

```bash
# Run unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov

# Run e2e tests
pnpm run test:e2e
```

## Code Quality

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   ├── guards/          # JWT and role guards
│   ├── decorators/      # Role decorators
│   └── dto/            # Data transfer objects
├── users/               # Users module
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── schemas/         # MongoDB schemas
│   └── dto/            # Data transfer objects
├── applications/        # Applications module
│   ├── applications.controller.ts
│   ├── applications.service.ts
│   ├── applications.module.ts
│   ├── schemas/         # MongoDB schemas
│   └── dto/            # Data transfer objects
├── app.controller.ts    # Main app controller
├── app.service.ts       # Main app service
├── app.module.ts        # Root module
└── main.ts             # Application entry point
```

## Database Schema

### Users Collection

- `email` (string, unique)
- `password` (string, hashed)
- `role` (string: 'user' | 'admin')
- `createdAt` (Date)
- `updatedAt` (Date)

### Applications Collection

- `userId` (ObjectId, ref: User)
- `firstName` (string)
- `lastName` (string)
- `passportNumber` (string)
- `nationality` (string)
- `visaType` (string)
- `purposeOfVisit` (string)
- `intendedArrivalDate` (Date)
- `intendedDepartureDate` (Date)
- `status` (string: 'pending' | 'approved' | 'rejected')
- `adminNotes` (string, optional)
- `createdAt` (Date)
- `updatedAt` (Date)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or your Atlas connection string is correct
   - Check if the database name in the connection string exists

2. **JWT Secret Missing**
   - Make sure `JWT_SECRET` is set in your `.env` file
   - Generate a strong secret key

3. **Port Already in Use**
   - Change the `PORT` in your `.env` file
   - Or kill the process using the current port

4. **Dependencies Issues**
   - Delete `node_modules` and `pnpm-lock.yaml`
   - Run `pnpm install` again

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

This project is licensed under the UNLICENSED license.
