import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getUserPreferences, updateUserPreferences, UserPreferences } from '../../services/api';

const Settings: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredLocation: [],
    deskType: [],
    accessibility: [],
    workDays: [],
    privacy: '',
    teamAdjacency: [],
    specialNeeds: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const data = await getUserPreferences('current-user');
      setPreferences(data);
    } catch (error) {
      setError('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateUserPreferences('current-user', preferences);
      setSuccess(true);
    } catch (error) {
      setError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleCheckboxChange = (category: keyof UserPreferences, value: string) => {
    setPreferences((prev) => {
      const currentValues = prev[category] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
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
        User Preferences
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Preferences saved successfully
        </Alert>
      )}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Preferred Location</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.preferredLocation.includes('window')}
                        onChange={() => handleCheckboxChange('preferredLocation', 'window')}
                      />
                    }
                    label="Near Window"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.preferredLocation.includes('team')}
                        onChange={() => handleCheckboxChange('preferredLocation', 'team')}
                      />
                    }
                    label="Near Team"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.preferredLocation.includes('quiet')}
                        onChange={() => handleCheckboxChange('preferredLocation', 'quiet')}
                      />
                    }
                    label="Quiet Zone"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Desk Type</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.deskType.includes('standing')}
                        onChange={() => handleCheckboxChange('deskType', 'standing')}
                      />
                    }
                    label="Standing Desk"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.deskType.includes('ergonomic')}
                        onChange={() => handleCheckboxChange('deskType', 'ergonomic')}
                      />
                    }
                    label="Ergonomic Desk"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferences.deskType.includes('dual-monitor')}
                        onChange={() => handleCheckboxChange('deskType', 'dual-monitor')}
                      />
                    }
                    label="Dual Monitor Setup"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel component="legend">Privacy Preference</FormLabel>
                <TextField
                  select
                  value={preferences.privacy}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, privacy: e.target.value }))
                  }
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="open">Open Desk</option>
                  <option value="cubicle">Private Cubicle</option>
                  <option value="office">Private Office</option>
                </TextField>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : 'Save Preferences'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings; 