import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import AlterarCadastro from '../pages/AlterarCadastro';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/alterarCadastro" element={<AlterarCadastro />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
