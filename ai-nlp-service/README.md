# AI-Enhanced Real-Time Occupancy Planning System - AI-NLP Service

This is the Natural Language Processing service for the AI-Enhanced Real-Time Occupancy Planning System. It handles natural language understanding, intent recognition, and query processing for the occupancy planning system.

## Features

- Natural language query processing
- Intent recognition for desk assignments
- Preference extraction from text
- Constraint parsing for optimization
- Multi-language support
- Context-aware responses

## Prerequisites

- Python 3.8 or higher
- Redis 6 or higher
- CUDA-capable GPU (recommended)
- 8GB+ RAM
- 20GB+ free disk space

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
   MODEL_PATH=./models
   CUDA_VISIBLE_DEVICES=0
   BATCH_SIZE=32
   MAX_SEQUENCE_LENGTH=512
   ```

4. Download pre-trained models:
   ```bash
   python scripts/download_models.py
   ```

5. Start the NLP service:
   ```bash
   uvicorn app.main:app --reload
   ```

The service will be available at `http://localhost:5002`.

## API Documentation

Once the service is running, you can access the API documentation at:
- Swagger UI: `http://localhost:5002/docs`
- ReDoc: `http://localhost:5002/redoc`

## Project Structure

```
ai-nlp-service/
  ├── app/
  │   ├── api/          # API endpoints
  │   ├── core/         # Core functionality
  │   ├── models/       # NLP models
  │   ├── processors/   # Text processors
  │   └── main.py       # Application entry point
  ├── models/           # Pre-trained models
  ├── scripts/          # Utility scripts
  ├── tests/            # Test suite
  ├── .env              # Environment variables
  └── requirements.txt  # Python dependencies
```

## Dependencies

- FastAPI
- Transformers (Hugging Face)
- PyTorch
- SpaCy
- Redis
- NumPy
- pytest

## NLP Models

The service implements several NLP models:

1. **Intent Recognition Model**
   - Classifies user queries into intents
   - Handles multiple intents per query
   - Provides confidence scores
   - Supports context awareness

2. **Entity Extraction Model**
   - Extracts preferences from text
   - Identifies constraints
   - Recognizes time expressions
   - Handles location references

3. **Query Understanding Model**
   - Processes complex queries
   - Resolves ambiguities
   - Handles follow-up questions
   - Maintains conversation context

## Development

The AI-NLP service uses state-of-the-art transformer models for natural language understanding. Key features include:

- Real-time query processing
- Multi-language support
- Context management
- Entity recognition
- Intent classification
- Response generation

## Testing

Run the test suite:
```bash
pytest
```

## Performance Considerations

- The service uses Redis for caching model outputs
- Models are loaded into GPU memory when available
- Batch processing for multiple queries
- Model quantization for faster inference
- Response caching for common queries

## Model Training

To train custom models:

1. Prepare your dataset:
   ```bash
   python scripts/prepare_dataset.py
   ```

2. Fine-tune the models:
   ```bash
   python scripts/train_models.py
   ```

3. Evaluate the models:
   ```bash
   python scripts/evaluate_models.py
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 