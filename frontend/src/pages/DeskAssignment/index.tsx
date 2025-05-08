import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { RootState } from '../../store';
import { fetchDesks, assignDesk, Desk } from '../../services/api';

const DeskAssignment: React.FC = () => {
  const dispatch = useDispatch();
  const [desks, setDesks] = useState<Desk[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    loadDesks();
  }, []);

  const loadDesks = async () => {
    setLoading(true);
    try {
      const data = await fetchDesks();
      setDesks(data);
    } catch (error) {
      console.error('Failed to load desks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDesk = async () => {
    if (!selectedDesk || !selectedUserId) return;

    try {
      await assignDesk(selectedDesk.id, selectedUserId);
      await loadDesks();
      setOpenDialog(false);
      setSelectedDesk(null);
      setSelectedUserId('');
    } catch (error) {
      console.error('Failed to assign desk:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'error';
      case 'reserved':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Desk Assignment
      </Typography>

      <Grid container spacing={3}>
        {desks.map((desk) => (
          <Grid item xs={12} sm={6} md={4} key={desk.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {desk.name}
                </Typography>
                <Box mb={2}>
                  <Chip
                    label={desk.status}
                    color={getStatusColor(desk.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip label={desk.type} variant="outlined" size="small" />
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Features:
                </Typography>
                <Box mb={2}>
                  {desk.features.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                {desk.status === 'available' && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {
                      setSelectedDesk(desk);
                      setOpenDialog(true);
                    }}
                  >
                    Assign Desk
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Assign Desk</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              label="Select User"
            >
              <MenuItem value="user1">John Doe</MenuItem>
              <MenuItem value="user2">Jane Smith</MenuItem>
              <MenuItem value="user3">Bob Johnson</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAssignDesk}
            variant="contained"
            color="primary"
            disabled={!selectedUserId}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeskAssignment; 