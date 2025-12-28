import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login_Register_Screen from '../components/Login';
import Ong_register from '../components/Ong_register';
import Feed from '../components/Feed';
// Importe outras páginas quando existirem

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login_Register_Screen />} />
        <Route path="/ong_register" element={<Ong_register />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
