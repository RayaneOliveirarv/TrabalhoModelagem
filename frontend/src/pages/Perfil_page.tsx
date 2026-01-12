import { use, useState } from "react";

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

import { getUserData } from "../contexts/AuthContext";
import { useEffect } from "react";
const Perfil_page = ()=>{
    const [active_Screen, setActiveScreen] = useState("MeusPosts")
    const [screen_element, setScreen_element] = useState<any>(<MeusPosts/>)
    const [is_enabled, setIs_enabled] = useState(false);

    interface UserProfileData {
        email: string;
        tipo: 'ADOTANTE' | 'PROTETOR' | 'ONG';
        // Campos de Adotante
        adotante_nome?:  string;
        adotante_cpf?: string;
        // Campos de Protetor
        protetor_nome?: string;
        protetor_cpf?: string;
        protetor_contato?: string;
        protetor_localizacao?: string;
        // Campos de ONG
        ong_nome?: string;
        ong_razao_social?: string;
        ong_cnpj?: string;
        ong_localizacao?: string;
        }
    const [user_Data, setUser_Data] = useState<UserProfileData>();

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
    const loadUserData = async () => {
            try{
                const cachedData = localStorage.getItem("user_data");
                
                if (cachedData) {
                    setUser_Data(JSON.parse(cachedData)[0]);
                    return;
                } 
                await getUserData();
                const userData = localStorage.getItem("user_data");
                setUser_Data(userData ? JSON.parse(userData) : null);
                }
            catch(err){
                console.log(err)
            }
        }
    useEffect(()=>{
        loadUserData();
    }
    ,[])
    const teste = ()=>{
        console.log(user_Data)
        loadUserData();
    }

    return(
    <div className="perf-Perfil">
        <NavbarPrincipal/>
            <div className="perf-Main_Content">
                <div className="perf-white_box">
                    <div className="perf-User-info">
                    <div className="perf-row">
                        <img src={template} className="perf-user_photo" alt="User profile photo"/>
                        <div className="perf-column_start">
                            <p className="perf-User-text"><b>{user_Data?.adotante_nome}{user_Data?.protetor_nome}{user_Data?.ong_nome}</b></p>
                            <p className="perf-User-text">{user_Data?.email}</p>
                            <div className="perf-row">
                                <p className="perf-User-text"><FaMapPin/>TODO</p>
                                <p className="perf-User-text"><FaCalendarAlt/>TODO</p>
                            </div>
                            <div className="perf-row perf-userTags">

                            </div>
                        </div>
                    </div>

                        </div>
                        <hr style={{width:"70%"}}/>
                    <div className="perf-user_awards">
                        <div className="perf-award_item">
                            <FaPaw/>
                            <p className="perf-center-text">N</p> 
                            <p className="perf-center-text">TODO</p>
                        </div>
                        <div className="perf-award_item">
                            <FaRegHeart/>
                            <p className="perf-center-text">N</p> 
                            <p className="perf-center-text">TODO</p>
                        </div>
                        <div className="perf-award_item">
                            <FaAward/>
                            <p className="perf-center-text">N</p> 
                            <p className="perf-center-text">TODO</p>
                        </div>
                    </div>
                </div>
                <div className="perf-center">
                {screen_selector()}
                </div>
                <button onClick={()=>teste()}>teste</button>
                <div className="perf-Selected_content">
                {screen_element}
                </div>
            </div>
    </div>
    )
}

export default Perfil_page;