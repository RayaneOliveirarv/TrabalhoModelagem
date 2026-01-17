import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

import { FaMapPin } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPaw } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaAward } from "react-icons/fa6";

import MeusPosts from "../components/MeusPosts";
import Favoritos from "../components/Favoritos";
import template from "../assets/img/template_image.jpg";
import NavbarPrincipal from "../components/NavbarPrincipal";
import "../styles/Perfil_Page/Perf-style.css";

const Perfil_page = ()=>{
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [animaisCount, setAnimaisCount] = useState(0);
    const [active_Screen, setActiveScreen] = useState("Favoritos");
    const [screen_element, setScreen_element] = useState<any>(<Favoritos/>);

    useEffect(() => {
        const carregarPerfil = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                // Busca animais do usuário
                const animais = await api.listarAnimais();
                const meusAnimais = animais.filter((animal: any) => 
                    animal.ong_id === user.id || animal.protetor_id === user.id
                );
                setAnimaisCount(meusAnimais.length);
                
                // Define os dados do perfil
                setUserProfile({
                    nome: user.email?.split('@')[0] || 'Usuário',
                    email: user.email,
                    tipo: user.tipo,
                    dataCriacao: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                });
            } catch (err) {
                console.error('Erro ao carregar perfil:', err);
            } finally {
                setLoading(false);
            }
        };
        
        carregarPerfil();
    }, [user]);

    const Screens = 
        [
        {name:"MeusPosts",component:<MeusPosts/>},
        {name:"Favoritos",component:<Favoritos/>},
        ]
    const choose_screen = (Screen:string)=>{
        setActiveScreen(Screen)
        setScreen_element(Screens.find(screen=>screen.name===Screen)?.component)
    }
        const screen_selector = ()=>{
        return(
            <div className="perf-screen_selector">
            {Screens.map(screen => (
                <button
                key={screen.name}
                className={`perf-screen_item${active_Screen === screen.name ? " active" : ""}`}
                onClick={() => choose_screen(screen.name)}
                >
                {screen.name}
                </button>
            ))}
            </div>
        )
    }

    return(
    <div className="perf-Perfil">
        <NavbarPrincipal/>
            <div className="perf-Main_Content">
                <div className="perf-white_box">
                    <div className="perf-User-info">
                    <div className="perf-row">
                        <div className="perf-avatar">
                            {userProfile?.nome?.charAt(0).toUpperCase()}
                        </div>
                        <div className="perf-column_start">
                            {loading ? (
                                <p className="perf-User-text">Carregando...</p>
                            ) : (
                                <>
                                    <p className="perf-User-text"><b>{userProfile?.nome || 'Usuário'}</b></p>
                                    <p className="perf-User-text">{userProfile?.email || 'email@gmail.com'}</p>
                                    <div className="perf-row">
                                        <p className="perf-User-text"><FaMapPin/> Brasil</p>
                                        <p className="perf-User-text"><FaCalendarAlt/> Membro desde {userProfile?.dataCriacao || 'Janeiro 2026'}</p>
                                    </div>
                                    <div className="perf-row perf-userTags">
                                        <span style={{background: '#667eea', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px'}}>
                                            {userProfile?.tipo || 'ADOTANTE'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                        </div>
                        <hr style={{width:"70%"}}/>
                    <div className="perf-user_awards">
                        <div className="perf-award_item">
                            <FaPaw/>
                            <p className="perf-center-text">{animaisCount}</p> 
                            <p className="perf-center-text">Posts</p>
                        </div>
                        <div className="perf-award_item">
                            <FaRegHeart/>
                            <p className="perf-center-text">0</p> 
                            <p className="perf-center-text">Ajudas</p>
                        </div>
                        <div className="perf-award_item">
                            <FaAward/>
                            <p className="perf-center-text">0</p> 
                            <p className="perf-center-text">Adoções</p>
                        </div>
                    </div>
                </div>
                <div className="perf-center">
                {screen_selector()}
                </div>
                <div className="perf-Selected_content">
                {screen_element}
                </div>
            </div>
    </div>
    )
}

export default Perfil_page;