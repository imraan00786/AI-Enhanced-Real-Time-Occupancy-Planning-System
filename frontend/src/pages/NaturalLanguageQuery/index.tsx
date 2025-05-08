import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { processNaturalLanguageQuery } from '../../services/api';

interface QueryResponse {
  type: 'desk_assignment' | 'occupancy_info' | 'preference_update' | 'error';
  message: string;
  data?: any;
}

const NaturalLanguageQuery: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<QueryResponse[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await processNaturalLanguageQuery(query);
      setResponses((prev) => [...prev, response]);
      setQuery('');
    } catch (error) {
      setResponses((prev) => [
        ...prev,
        {
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to process query',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Natural Language Query
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Ask questions about desk availability, make reservations, or update your preferences using natural language.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="e.g., Find me an available standing desk near the window"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !query.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              >
                Send
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Conversation History
          </Typography>
          <List>
            {responses.map((response, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={response.message}
                    secondary={response.type}
                    sx={{
                      color: response.type === 'error' ? 'error.main' : 'text.primary',
                    }}
                  />
                </ListItem>
                {index < responses.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NaturalLanguageQuery; 