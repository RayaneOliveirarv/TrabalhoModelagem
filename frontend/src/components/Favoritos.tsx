import "../styles/Perfil_Page/Perf-style.css";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Perfil_Post_View from "./Perfil_Post_view";

const Favoritos : React.FC = () => {
    const { user } = useAuth();
    const [meusAnimais, setMeusAnimais] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarMeusPosts = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                const animais = await api.listarFavoritos(user.id);
                console.log("Favoritos: ",animais)
                // Filtra apenas os animais do usuário logado
                setMeusAnimais(animais);
            } catch (err) {
                console.error('Erro ao carregar posts:', err);
            } finally {
                setLoading(false);
            }
        };
        
        carregarMeusPosts();
    }, [user]);

    if (loading) {
        return (
            <div className="SelectedContent" style={{padding: '40px', textAlign: 'center', color: '#666'}}>
                <p>Carregando seus posts...</p>
            </div>
        );
    }

    if (meusAnimais.length === 0) {
        return (
            <div className="SelectedContent" style={{padding: '40px', textAlign: 'center', color: '#666'}}>
                <p>Você ainda não criou nenhum post.</p>
                <p style={{fontSize: '14px', marginTop: '8px'}}>Clique em "Novo Post" no feed para cadastrar um animal.</p>
            </div>
        );
    }

    return(
        <div className="SelectedContent" style={{display: 'flex', flexDirection: 'column', gap: '16px', width: '100%'}}>
            {meusAnimais.map((animal) => (
                <Perfil_Post_View 
                    key={animal.id}
                    id={animal.id}
                    nome={animal.nome}
                    status={animal.categoria}
                    foto={animal.foto_url}
                    dataCriacao={animal.data_criacao}
                    isFav={true}
                />
            ))}
        </div>
    )
}

export default Favoritos;