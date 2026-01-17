import React from 'react';
import '../styles/AlterarContaONG/AlterarContaONG.css';
import api from '../services/api';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AlterarContaONG: React.FC = () => {
  const {user, updateUser} = useAuth();
  const navigator = useNavigate();
  const [Message, setMessage] = useState('');
  const [data, setData] = useState({
    tipo:'ONG',
    cpf:'',
    cnpj:'',
    nome: '',
    email: '',
    historia:'',
    contato:'',
  });
  const on_submit = async (e:any) => {
    e.preventDefault();
    try{
      const response = await api.atualizarPerfil(user!.id, data.tipo, data);
      setMessage(response.mensagem);
        
        try {
          const userData = {
          id: user?.id,
          email: user?.email,
          tipo: data.tipo as "ONG" | "PROTETOR" | "ADOTANTE" | "ADMIN",
          status_conta: user?.status_conta,
        };
          updateUser(userData);
        } catch (error) {
          console.error('Erro ao carregar usuário do localStorage:', error);
          localStorage.removeItem('@olpet:user');
        }
}
    catch(err: any){
      console.log(err);
    }
    finally{
        resposta();
    }
};
  const resposta = () => {
    return (
      alert("Atualizado com Sucesso!"), navigator('/feed')
    );
  }

  return (
    <div>
      {
        <div className="alterar-cadastro-bg">
        <div className="alterar-cadastro-center">
          <div className="alterar-cadastro-card">
            <h2 className="alterar-cadastro-title">Alterar a conta para uma conta de ONG</h2>
            <form onSubmit={(e) => on_submit(e)}>
              <div className="input-row">
                <div>
                  <label>Nome fantasia</label>
                  <input type="text" className="input-ong"
                  disabled={data.tipo === 'PROTETOR'}/>
                </div>
                <div>
                  <label>Tipo</label>
                  <select style={{backgroundColor:"#fffbfc",color:"black",border:"1px solid lightblue"}} onChange={e => setData({...data, tipo: e.target.value})}>
                    <option value="ONG">ONG</option>
                    <option value="PROTETOR">PROTETOR</option>
                  </select>
                </div>
              </div>
              <div className="input-row">
                <div>
                  <label>CPF</label>
                  <input type="text" className="input-ong" onChange={e => setData({...data, cpf: e.target.value})} disabled={data.tipo === 'ONG'}/>
                </div>
                <div>
                  <label>CNPJ</label>
                  <input type="text" className="input-ong" onChange={e => setData({...data, cnpj: e.target.value})} 
                  disabled={data.tipo === 'PROTETOR'}/>
                </div>
                <div>
                  <label>Nome responsável</label>
                  <input type="text" className="input-ong" onChange={e => setData({...data, nome: e.target.value})}/>
                </div>
              </div>
              <div className="input-row">
                <div>
                  <label>Email</label>
                  <input type="email" className="input-ong" value={user?.email} onChange={e => setData({...data, email: e.target.value})}/>
                </div>
                <div>
                  <label>Contato</label>
                  <input type="text" className="input-ong" onChange={e => setData({...data, contato: e.target.value})} disabled={data.tipo === 'PROTETOR'}/>
                </div>
              </div>
              <div className="input-row">
                <div>
                  <label>Endereço</label>
                  <input type="text" className="input-ong"/>
                </div>
                <div>
                  <label>CEP</label>
                  <input type="text" className="input-ong"/>
                </div>
              </div>
              <label>Motivação da organização</label>
              <textarea className="input-ong textarea-ong" rows={4} onChange={e => setData({...data, historia: e.target.value})} disabled={data.tipo === 'PROTETOR'}/>
              <div className="form-footer">
                <button type="submit" className="alterar-cadastro-btn">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
    </div>
    
  );
};

export default AlterarContaONG;
