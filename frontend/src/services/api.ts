import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Area {
  id: string;
  name: string;
  occupancy: number;
  capacity: number;
  lastUpdated: string;
}

export interface Desk {
  id: string;
  areaId: string;
  name: string;
  type: string;
  features: string[];
  status: 'available' | 'occupied' | 'reserved';
}

export interface UserPreferences {
  preferredLocation: string[];
  deskType: string[];
  accessibility: string[];
  workDays: string[];
  privacy: string;
  teamAdjacency: string[];
  specialNeeds: string[];
}

export const fetchOccupancyData = async (): Promise<Area[]> => {
  const response = await api.get('/occupancy');
  return response.data;
};

export const fetchDesks = async (): Promise<Desk[]> => {
  const response = await api.get('/desks');
  return response.data;
};

export const assignDesk = async (deskId: string, userId: string): Promise<Desk> => {
  const response = await api.post('/desks/assign', { deskId, userId });
  return response.data;
};

export const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
  const response = await api.get(`/users/${userId}/preferences`);
  return response.data;
};

export const updateUserPreferences = async (
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> => {
  const response = await api.put(`/users/${userId}/preferences`, preferences);
  return response.data;
};

export const processNaturalLanguageQuery = async (query: string): Promise<any> => {
  const response = await api.post('/nlp/query', { query });
  return response.data;
};

export default api; 