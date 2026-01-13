import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Ajuste o caminho conforme seu projeto
import api from '../services/api'; // Ajuste o caminho conforme seu projeto

const Privacy: React.FC = () => {
    // 1. Definição dos Estados
    const { user } = useAuth();
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

    // 2. Lógica de Envio
    const handleAlterarSenha = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });

        // Validação básica: Senhas coincidem?
        if (novaSenha !== confirmarSenha) {
            setMensagem({ tipo: 'erro', texto: 'A nova senha e a confirmação não coincidem.' });
            return;
        }

        // Validação básica: A nova senha é diferente da antiga?
        if (senhaAtual === novaSenha) {
            setMensagem({ tipo: 'erro', texto: 'A nova senha deve ser diferente da senha atual.' });
            return;
        }

        setLoading(true);

        try {
            // Chamada para a API (Certifique-se de que este método exista no seu api.ts)
            // Geralmente enviamos o id do usuário, a senha antiga e a nova
            await api.atualizarSenha({
                usuarioId: user?.id,
                senhaAtual,
                novaSenha
            });

            setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
            
            // Limpa os campos após o sucesso
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            
        } catch (error: any) {
            const erroMsg = error.response?.data?.erro || 'Erro ao alterar senha. Verifique sua senha atual.';
            setMensagem({ tipo: 'erro', texto: erroMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="conf-Privacidade">
            <div className="conf-Content">
                <div style={{ marginBottom: '32px' }}>
                    <p><b>Alterar Senha</b></p>
                    <p className="conf-fade" style={{ marginBottom: '16px' }}>
                        Para sua segurança, escolha uma senha forte
                    </p>

                    
                    
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

                        {/* Exibição de mensagens de feedback */}
                        {mensagem.texto && (
                            <div className={`conf-alert ${mensagem.tipo === 'erro' ? 'conf-alert-error' : 'conf-alert-success'}`}>
                                {mensagem.texto}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="conf-submit_btn"
                            disabled={loading}
                        >
                            {loading ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Privacy;