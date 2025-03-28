import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';
import { SettingsProvider } from './context/SettingsContext';
import SettingsPopup from './components/SettingsPopup';
import './App.css';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <Router>
        <SettingsPopup />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Router>
    </SettingsProvider>
  );
};

export default App;
