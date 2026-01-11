import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const Perfil: React.FC = ()=>{
    const { user, updateUser } = useAuth();
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            // Preenche os campos com os dados do usuário
            const emailParts = user.email.split('@');
            setNome(emailParts[0] || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const dados = {
                nome: nome + (sobrenome ? ` ${sobrenome}` : ''),
                telefone,
                cidade,
                estado
            };

            await api.atualizarPerfil(user.id, user.tipo, dados);
            setSuccess('Perfil atualizado com sucesso!');
            
            // Atualiza o contexto do usuário
            updateUser({ ...user, nome: dados.nome });
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="conf-Perfil">
            <p style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#667eea'}}>Informações Pessoais</p>
            
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

            <form onSubmit={handleSubmit}>
                <div className="conf-Content">
                    <div className="conf-row">
                        <div className="conf-Input_Container">
                            <p><b>Nome:</b></p>
                            <input 
                                type="text" 
                                className="conf-Input_p conf-thin_border" 
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                style={{width:"100%"}}
                            />
                        </div>
                        <div className="conf-Input_Container">
                            <p><b>Sobrenome:</b></p>
                            <input 
                                type="text" 
                                className="conf-Input_p conf-thin_border" 
                                value={sobrenome}
                                onChange={(e) => setSobrenome(e.target.value)}
                                style={{width:"100%"}}
                            />
                        </div>
                    </div>
                    <div className="conf-Input_Container">
                        <p><b>Email:</b></p>
                        <input 
                            type="email" 
                            className="conf-Input_p conf-thin_border" 
                            value={email}
                            disabled
                            style={{opacity: 0.6, cursor: 'not-allowed'}}
                        />
                        <small style={{color: '#666', fontSize: '12px'}}>O email não pode ser alterado</small>
                    </div>
                    <div className="conf-Input_Container">
                        <p><b>Telefone:</b></p>
                        <input 
                            type="text" 
                            className="conf-Input_p conf-thin_border" 
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    <div className="conf-row">
                        <div className="conf-Input_Container">
                            <p><b>Cidade:</b></p>
                            <input 
                                type="text" 
                                className="conf-Input_p conf-thin_border"
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                placeholder="Ex: Juiz de Fora"
                            />
                        </div>
                        <div className="conf-Input_Container">
                            <p><b>Estado:</b></p>
                            <input 
                                type="text" 
                                className="conf-Input_p conf-thin_border"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                placeholder="Ex: MG"
                                maxLength={2}
                            />
                        </div>
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="conf-submit_btn"
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </form>
        </div>
    )
}
export default Perfil;