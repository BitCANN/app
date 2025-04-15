import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { withProviders } from './hoc/withProviders';
import App from './App';
import './index.css';
import { Box } from '@mui/material';
import TopNavBar from './components/TopNavBar';
import reportWebVitals from './reportWebVitals';

const WrappedApp = withProviders(App);

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <Box
      sx={{
        background: '#1B2030',
        minHeight: '100vh',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(130, 71, 229, 0.02) 0%, rgba(130, 71, 229, 0.01) 100%)',
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <TopNavBar />
      <Router>
        <Routes>
          <Route path="/" element={<WrappedApp />} />
        </Routes>
      </Router>
    </Box>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
