import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
const Account : React.FC = ()=>{
    const { user } = useAuth();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigator = useNavigate();

    const handleExcluirConta = async () => {
        if (!user) return;
        
        const confirmar = window.confirm(
            'Tem certeza que deseja excluir sua conta? Esta ação é permanente e não pode ser desfeita!'
        );
        
        if (!confirmar) return;

        try {
            await api.deletarConta(user.id);
            window.location.href = '/';
        } catch (err: any) {
            setError('Erro ao excluir conta: ' + err.message);
        }
    };

    return(
        <div className="conf-Account">
            <p style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#667eea'}}>Gerenciar Conta</p>
                <div style={{marginBottom: '32px'}}>
                    <p><b>Exportar dados</b></p>
                    <p className="conf-fade">Baixe uma cópia de todos os seus dados da plataforma</p>
                    <button className="conf-submit_btn">Baixar</button>
                </div>
                
                <hr className="conf-thin_border" style={{margin: '32px 0'}}/>
                
                <div>
                    <p><b>Alterar tipo</b></p>
                    <p className="conf-fade">Essa ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos</p>
                    <button 
                        className="conf-submit_btn" 
                        onClick={()=>navigator('/alterarCadastro')}
                    >
                        Alterar
                    </button>
                </div>
                <hr className="conf-thin_border" style={{margin: '32px 0'}}/>
                <div>
                    <p><b>Excluir conta</b></p>
                    <p className="conf-fade">Essa ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos</p>
                    <button 
                        className="conf-submit_btn" 
                        style={{background: 'linear-gradient(90deg, #f44336 0%, #e91e63 100%)'}}
                        onClick={handleExcluirConta}
                    >
                        Apagar
                    </button>
                </div>
        </div>
    )
}

export default Account;