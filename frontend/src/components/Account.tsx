import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const Account : React.FC = ()=>{
    const { user } = useAuth();
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleAlterarSenha = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setError('');
        setSuccess('');

        // Validações
        if (novaSenha.length < 6) {
            setError('A nova senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        setLoading(true);

        try {
            // Aqui você precisaria adicionar um endpoint no backend para alterar senha
            // await api.alterarSenha(user.id, senhaAtual, novaSenha);
            setSuccess('Senha alterada com sucesso!');
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
        } catch (err: any) {
            setError(err.message || 'Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

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
            
            {success && (
                <div style={{background: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px'}}>
                    {success}
                </div>
            )}
            
            {error && (
                <div style={{background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px'}}>
                    {error}
                </div>
            )}

            <div className="conf-Content">
                <div style={{marginBottom: '32px'}}>
                    <p><b>Alterar Senha</b></p>
                    <p className="conf-fade" style={{marginBottom: '16px'}}>Para sua segurança, escolha uma senha forte</p>
                    
                    <form onSubmit={handleAlterarSenha}>
                        <div className="conf-Input_Container">
                            <p><b>Senha Atual:</b></p>
                            <input 
                                type="password" 
                                className="conf-Input_p conf-thin_border"
                                value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                required
                                placeholder="Digite sua senha atual"
                            />
                        </div>
                        
                        <div className="conf-Input_Container">
                            <p><b>Nova Senha:</b></p>
                            <input 
                                type="password" 
                                className="conf-Input_p conf-thin_border"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                required
                                placeholder="Digite a nova senha (mínimo 6 caracteres)"
                                minLength={6}
                            />
                        </div>
                        
                        <div className="conf-Input_Container">
                            <p><b>Confirmar Nova Senha:</b></p>
                            <input 
                                type="password" 
                                className="conf-Input_p conf-thin_border"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required
                                placeholder="Confirme a nova senha"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="conf-submit_btn"
                            disabled={loading}
                        >
                            {loading ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                    </form>
                </div>
                
                <hr className="conf-thin_border" style={{margin: '32px 0'}}/>
                
                <div style={{marginBottom: '32px'}}>
                    <p><b>Exportar dados</b></p>
                    <p className="conf-fade">Baixe uma cópia de todos os seus dados da plataforma</p>
                    <button className="conf-submit_btn">Baixar</button>
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
        </div>
    )
}

export default Account;