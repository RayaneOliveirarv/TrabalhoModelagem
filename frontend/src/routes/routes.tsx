import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import AlterarCadastro from '../pages/AlterarCadastro';
import AlterarContaONG from '../pages/AlterarContaONG';
import Feed from '../pages/Feed';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/alterarCadastro" element={<AlterarCadastro />} />
        <Route path="/alterar-conta-ong" element={<AlterarContaONG />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
