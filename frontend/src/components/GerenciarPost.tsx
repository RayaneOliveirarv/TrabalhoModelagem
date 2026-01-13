import "../styles/Perfil_Page/Perf-style.css";
import { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface GerenciarPostProps {
    setShowManage: React.Dispatch<React.SetStateAction<boolean>>;
    animalId: number;
}

const GerenciarPost: React.FC<GerenciarPostProps> = ({ setShowManage, animalId }) => {
    const { user } = useAuth();
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('Felino');
    const [estado, setEstado] = useState('Perdido');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagem, setImagem] = useState<File | null>(null);
    const [cidades, setCidades] = useState<string[]>([]);
    const [carregandoCidades, setCarregandoCidades] = useState(false);
    const [carregandoPost, setCarregandoPost] = useState(true);
    const [imagemAtual, setImagemAtual] = useState<string>('');
    const [porte, setPorte] = useState<string>('Médio');
    const [idade, setIdade] = useState<string>('');

    // Carregar dados do post
    useEffect(() => {
        const carregarPost = async () => {
            try {
                setCarregandoPost(true);
                const post = await api.buscarAnimal(animalId);
                
                setNome(post.nome || '');
                setTipo(post.especie || 'Felino');
                setEstado(post.categoria || 'Perdido');
                setLocalizacao(post.localizacao || '');
                setDescricao(post.descricao || '');
                setPorte(post.porte || 'Médio');
                setIdade(post.idade || '');
                setImagemAtual(post.foto_url || '');
            } catch (error) {
                console.error('Erro ao carregar post:', error);
                alert('Erro ao carregar informações do post');
            } finally {
                setCarregandoPost(false);
            }
        };

        carregarPost();
    }, [animalId]);

    // Carregar cidades do IBGE
    useEffect(() => {
        if (cidades.length === 0) {
            setCarregandoCidades(true);
            fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome")
                .then(response => response.json())
                .then(data => {
                    const formatado = data.map((mun: any) =>
                        `${mun.nome} - ${mun.microrregiao?.mesorregiao?.UF?.sigla || 'UF'}`
                    );
                    setCidades(formatado);
                })
                .catch(err => console.error("Erro ao carregar cidades:", err))
                .finally(() => setCarregandoCidades(false));
        }
    }, [cidades.length]);

    const handleAtualizar = async () => {
        try {
            if (!nome.trim() || !localizacao || !descricao.trim()) {
                alert('Por favor, preencha todos os campos obrigatórios');
                return;
            }

            // Se houver nova imagem, usar FormData
            if (imagem) {
                const formData = new FormData();
                formData.append('nome', nome);
                formData.append('especie', tipo);
                formData.append('categoria', estado);
                formData.append('localizacao', localizacao);
                formData.append('descricao', descricao);
                formData.append('porte', porte);
                if (idade) formData.append('idade', idade);
                formData.append('imagem', imagem);
                if (user?.id) formData.append('usuario_id', user.id.toString());

                // Para upload com imagem, precisaria de um endpoint específico
                // Por enquanto, vamos atualizar sem a imagem
                await api.atualizarAnimal(animalId, {
                    nome,
                    especie: tipo,
                    categoria: estado,
                    localizacao,
                    descricao,
                    porte,
                    idade: idade || null,
                });
            } else {
                // Atualizar sem imagem
                await api.atualizarAnimal(animalId, {
                    nome,
                    especie: tipo,
                    categoria: estado,
                    localizacao,
                    descricao,
                    porte,
                    idade: idade || null,
                });
            }

            alert('Post atualizado com sucesso!');
            setShowManage(false);
            window.location.reload(); // Recarregar para mostrar mudanças
        } catch (error: any) {
            console.error('Erro ao atualizar post:', error);
            alert(error.message || 'Erro ao atualizar post');
        }
    };

    const handleExcluir = async () => {
        if (window.confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) {
            try {
                await api.deletarAnimal(animalId, user?.id);
                alert('Post excluído com sucesso!');
                setShowManage(false);
                window.location.reload(); // Recarregar para atualizar a lista
            } catch (error: any) {
                console.error('Erro ao excluir post:', error);
                alert(error.message || 'Erro ao excluir post');
            }
        }
    };

    if (carregandoPost) {
        return (
            <div className="perf-GerenciarPost">
                <button
                    className="perf-dots"
                    style={{ position: 'absolute', top: '20px', right: '20px', borderRadius: "50%", textAlign: "center" }}
                    onClick={() => setShowManage(false)}
                >
                    <IoCloseSharp />
                </button>
                <h2 style={{ color: '#667eea', marginTop: 0, marginBottom: '20px', fontSize: '1.3rem', textAlign: 'center' }}>
                    Carregando...
                </h2>
            </div>
        );
    }

    return (
        <div className="perf-GerenciarPost">
            <button
                className="perf-dots"
                style={{ position: 'absolute', top: '20px', right: '20px', borderRadius: "50%", textAlign: "center" }}
                onClick={() => setShowManage(false)}
            >
                <IoCloseSharp />
            </button>

            <h2 style={{ color: '#667eea', marginTop: 0, marginBottom: '20px', fontSize: '1.3rem' }}>
                Editar/excluir post
            </h2>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="Input_Container">
                    <label style={{ fontWeight: 500, color: '#444', fontSize: '0.95rem' }}>
                        Nome do animal:
                        <input
                            type="text"
                            className="perf-Input_p"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite o nome do animal"
                            style={{ marginTop: '6px' }}
                        />
                    </label>
                </div>

                <div className="Input_Container">
                    <label style={{ fontWeight: 500, color: '#444', fontSize: '0.95rem' }}>
                        Tipo do animal:
                        <select
                            name="animal"
                            className="perf-select_p"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            style={{ marginTop: '6px' }}
                        >
                            <option value="Felino">Felino</option>
                            <option value="Canino">Canino</option>
                            <option value="Cao">Cão</option>
                            <option value="Gato">Gato</option>
                            <option value="Ave">Ave</option>
                            <option value="Exotico">Exótico</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </label>
                </div>

                <div className="Input_Container">
                    <label style={{ fontWeight: 500, color: '#444', fontSize: '0.95rem' }}>
                        Estado do animal:
                        <select
                            name="estado"
                            className="perf-select_p"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            style={{ marginTop: '6px' }}
                        >
                            <option value="Perdido">Perdido</option>
                            <option value="Encontrado">Encontrado</option>
                            <option value="Adocao">Para Adoção</option>
                        </select>
                    </label>
                </div>

                <div className="Input_Container">
                    <label style={{ fontWeight: 500, color: '#444', fontSize: '0.95rem' }}>
                        Localização:
                        <select
                            className="perf-select_p"
                            value={localizacao}
                            onChange={(e) => setLocalizacao(e.target.value)}
                            disabled={carregandoCidades}
                            style={{ marginTop: '6px' }}
                        >
                            <option value="">
                                {carregandoCidades ? 'Carregando cidades...' : 'Selecione uma cidade'}
                            </option>
                            {cidades.map((cidade, index) => (
                                <option key={index} value={cidade}>{cidade}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="Input_Container">
                    <label style={{ fontWeight: 500, color: '#444', fontSize: '0.95rem' }}>
                        Descrição:
                        <textarea
                            name="description"
                            className="perf-textarea_p"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            rows={4}
                            placeholder="Descreva o animal..."
                            style={{ marginTop: '6px', width: '100%' }}
                        />
                    </label>
                </div>

                <div className="Input_Container">
                    <label style={{ fontWeight: 500, color: '#444', fontSize: '0.95rem' }}>
                        Upload img:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImagem(e.target.files?.[0] || null)}
                            style={{ marginTop: '6px' }}
                        />
                        {imagemAtual && !imagem && (
                            <span style={{ display: 'block', marginTop: '6px', fontSize: '0.85rem', color: '#888' }}>
                                Imagem atual: {imagemAtual.split('/').pop()}
                            </span>
                        )}
                        {imagem && (
                            <span style={{ display: 'block', marginTop: '6px', fontSize: '0.85rem', color: '#667eea', fontWeight: 500 }}>
                                Nova imagem: {imagem.name}
                            </span>
                        )}
                    </label>
                </div>

                <div className="perf-row" style={{ marginTop: '12px', gap: '12px' }}>
                    <button
                        type="button"
                        className="perf-Button"
                        onClick={handleAtualizar}
                        style={{ background: 'linear-gradient(90deg, #667eea 0%, #a1c4fd 100%)' }}
                    >
                        Atualizar
                    </button>
                    <button
                        type="button"
                        className="perf-Button perf-red"
                        onClick={handleExcluir}
                    >
                        Excluir post
                    </button>
                </div>
            </form>
        </div>
    )
}

export default GerenciarPost;