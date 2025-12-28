import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login_Register_Screen from '../components/Login';
// Importe outras páginas quando existirem

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login_Register_Screen />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
