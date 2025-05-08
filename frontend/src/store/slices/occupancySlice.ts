import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Area {
  id: string;
  name: string;
  occupancy: number;
  capacity: number;
  lastUpdated: string;
}

interface OccupancyState {
  areas: Area[];
  loading: boolean;
  error: string | null;
}

const initialState: OccupancyState = {
  areas: [],
  loading: false,
  error: null,
};

const occupancySlice = createSlice({
  name: 'occupancy',
  initialState,
  reducers: {
    setAreas: (state, action: PayloadAction<Area[]>) => {
      state.areas = action.payload;
    },
    updateAreaOccupancy: (state, action: PayloadAction<{ id: string; occupancy: number }>) => {
      const area = state.areas.find(a => a.id === action.payload.id);
      if (area) {
        area.occupancy = action.payload.occupancy;
        area.lastUpdated = new Date().toISOString();
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAreas, updateAreaOccupancy, setLoading, setError } = occupancySlice.actions;
export default occupancySlice.reducer; 