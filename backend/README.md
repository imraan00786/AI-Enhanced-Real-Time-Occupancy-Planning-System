# AI-Enhanced Real-Time Occupancy Planning System - Backend

This is the main backend service for the AI-Enhanced Real-Time Occupancy Planning System. It handles core business logic, data persistence, and integration with external services.

## Features

- RESTful API endpoints for occupancy management
- Real-time data processing with VergeSense integration
- User preference management
- Desk assignment and reservation system
- Integration with optimizer and AI-NLP services
- WebSocket support for real-time updates
- MongoDB for flexible data storage
- Redis for caching and real-time features

## Prerequisites

- Node.js 18 or higher
- MongoDB 6 or higher
- Redis 6 or higher
- VergeSense API credentials
- Docker (optional, for containerized deployment)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/occupancy_db
   REDIS_URL=redis://localhost:6379
   VERGESENSE_API_KEY=your_api_key
   VERGESENSE_API_SECRET=your_api_secret
   OPTIMIZER_SERVICE_URL=http://localhost:5001
   AI_NLP_SERVICE_URL=http://localhost:5002
   JWT_SECRET=your_jwt_secret
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`.

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:3001/api-docs`
- Postman Collection: Available in `/docs/postman`

### Key Endpoints

#### Desk Assignment
```
POST /api/assign-desk
```
Assigns a desk based on employee preferences and policies.

#### Availability Query
```
GET /api/query-availability
```
Returns available desks by floor/area.

#### Natural Language Query
```
POST /api/nlp-query
```
Processes natural language requests for desk booking.

## Project Structure

```
backend/
  ├── src/
  │   ├── api/          # API routes and controllers
  │   ├── config/       # Configuration files
  │   ├── models/       # MongoDB models
  │   ├── services/     # Business logic
  │   ├── utils/        # Helper functions
  │   └── app.ts        # Application entry point
  ├── tests/            # Test suite
  ├── docs/             # API documentation
  ├── .env              # Environment variables
  └── package.json      # Node.js dependencies
```

## Dependencies

- Express.js
- TypeScript
- MongoDB (Mongoose)
- Redis
- Socket.IO
- Jest
- Swagger/OpenAPI
- VergeSense SDK

## Development

The backend uses Express.js with TypeScript for type safety and better development experience. Key features include:

- RESTful API design
- WebSocket support for real-time updates
- MongoDB for flexible data storage
- Redis caching layer
- Comprehensive API documentation
- Integration testing suite

## Testing

Run the test suite:
```bash
npm test
```

## Docker Support

Build and run with Docker:
```bash
docker build -t occupancy-backend .
docker run -p 3001:3001 occupancy-backend
```

## Microservices Integration

The backend integrates with two microservices:

1. **Optimizer Service** (`http://localhost:5001`)
   - Handles desk assignment optimization
   - Implements constraint-based algorithms
   - Processes policy rules

2. **AI-NLP Service** (`http://localhost:5002`)
   - Processes natural language queries
   - Integrates with OpenAI GPT
   - Handles intent recognition

## License

This project is licensed under the MIT License - see the LICENSE file for details. 