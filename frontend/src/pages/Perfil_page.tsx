import { useState } from "react";

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
    const [user_Tags,setUser_Tags] = useState([]);

    const [active_Screen, setActiveScreen] = useState("MeusPosts")
    const [screen_element, setScreen_element] = useState<any>(<MeusPosts/>)
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
                        <img src={template} className="perf-user_photo" alt="User profile photo"/>
                        <div className="perf-column_start">
                            <p className="perf-User-text"><b>Nome</b></p>
                            <p className="perf-User-text">email@gmail.com</p>
                            <div className="perf-row">
                                <p className="perf-User-text"><FaMapPin/> Chique-chique bahia</p>
                                <p className="perf-User-text"><FaCalendarAlt/> Membro, desde Mês Ano</p>
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
                            <p className="perf-center-text">Posts</p>
                        </div>
                        <div className="perf-award_item">
                            <FaRegHeart/>
                            <p className="perf-center-text">N</p> 
                            <p className="perf-center-text">Ajudas</p>
                        </div>
                        <div className="perf-award_item">
                            <FaAward/>
                            <p className="perf-center-text">N</p> 
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