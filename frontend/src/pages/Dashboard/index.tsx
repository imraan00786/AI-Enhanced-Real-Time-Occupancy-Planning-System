import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { RootState } from '../../store';
import { setAreas, setLoading, setError } from '../../store/slices/occupancySlice';
import { fetchOccupancyData } from '../../services/api';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { areas, loading, error } = useSelector((state: RootState) => state.occupancy);

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch(setLoading(true));
        const data = await fetchOccupancyData();
        dispatch(setAreas(data));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to load occupancy data'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Occupancy Overview
        </Typography>
      </Grid>
      {areas.map((area) => (
        <Grid item xs={12} sm={6} md={4} key={area.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {area.name}
              </Typography>
              <Typography variant="h3" color="primary">
                {Math.round((area.occupancy / area.capacity) * 100)}%
              </Typography>
              <Typography color="textSecondary">
                {area.occupancy} of {area.capacity} spaces occupied
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Last updated: {new Date(area.lastUpdated).toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Dashboard; 