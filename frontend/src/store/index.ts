import { configureStore } from '@reduxjs/toolkit';
import occupancyReducer from './slices/occupancySlice';
import deskAssignmentReducer from './slices/deskAssignmentSlice';
import userPreferencesReducer from './slices/userPreferencesSlice';

export const store = configureStore({
  reducer: {
    occupancy: occupancyReducer,
    deskAssignment: deskAssignmentReducer,
    userPreferences: userPreferencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 