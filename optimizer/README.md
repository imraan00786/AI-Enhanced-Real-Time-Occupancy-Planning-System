# AI-Enhanced Real-Time Occupancy Planning System - Optimizer Service

This is the optimization service for the AI-Enhanced Real-Time Occupancy Planning System. It handles complex optimization algorithms for desk assignments and space utilization.

## Features

- Real-time desk assignment optimization
- Space utilization analysis
- Team adjacency optimization
- User preference matching
- Dynamic capacity planning
- Integration with AI-NLP service for natural language constraints

## Prerequisites

- Python 3.8 or higher
- Redis 6 or higher
- Gurobi Optimizer (commercial license required)
- NumPy
- Pandas
- SciPy

## Getting Started

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory:
   ```
   REDIS_URL=redis://localhost:6379
   GUROBI_LICENSE_KEY=your_license_key
   AI_NLP_SERVICE_URL=http://localhost:5002
   ```

4. Start the optimization service:
   ```bash
   uvicorn app.main:app --reload
   ```

The service will be available at `http://localhost:5001`.

## API Documentation

Once the service is running, you can access the API documentation at:
- Swagger UI: `http://localhost:5001/docs`
- ReDoc: `http://localhost:5001/redoc`

## Project Structure

```
optimizer/
  ├── app/
  │   ├── api/          # API endpoints
  │   ├── core/         # Core functionality
  │   ├── models/       # Optimization models
  │   ├── solvers/      # Optimization solvers
  │   └── main.py       # Application entry point
  ├── tests/            # Test suite
  ├── .env              # Environment variables
  └── requirements.txt  # Python dependencies
```

## Dependencies

- FastAPI
- Gurobi Optimizer
- NumPy
- Pandas
- SciPy
- Redis
- pytest

## Optimization Models

The service implements several optimization models:

1. **Desk Assignment Model**
   - Maximizes user preference satisfaction
   - Ensures team adjacency
   - Handles accessibility requirements
   - Optimizes space utilization

2. **Capacity Planning Model**
   - Predicts future space requirements
   - Optimizes resource allocation
   - Handles dynamic team sizes
   - Considers seasonal variations

3. **Team Adjacency Model**
   - Optimizes team seating arrangements
   - Minimizes cross-team interference
   - Balances collaboration and focus
   - Handles team growth and changes

## Development

The optimizer service uses FastAPI and Gurobi for high-performance optimization. Key features include:

- Real-time optimization
- Constraint handling
- Multi-objective optimization
- Integration with AI-NLP for natural language constraints
- Caching and result persistence

## Testing

Run the test suite:
```bash
pytest
```

## Performance Considerations

- The service uses Redis for caching optimization results
- Large-scale problems are solved incrementally
- Results are persisted for quick retrieval
- Optimization parameters can be tuned for different scenarios

## License

This project is licensed under the MIT License - see the LICENSE file for details. 