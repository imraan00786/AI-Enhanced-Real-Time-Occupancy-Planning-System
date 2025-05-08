import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DeskAssignment from './pages/DeskAssignment';
import NaturalLanguageQuery from './pages/NaturalLanguageQuery';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/desk-assignment" element={<DeskAssignment />} />
              <Route path="/nlp-query" element={<NaturalLanguageQuery />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 