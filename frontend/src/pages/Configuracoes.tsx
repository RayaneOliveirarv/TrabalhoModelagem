import NavbarPrincipal from "../components/NavbarPrincipal"
import "../styles/Configuracoes/Conf_style.css"
import { useState } from "react"

import Perfil from "../components/Perfil"
import Privacy from "../components/Privacy"
import Account from "../components/Account"

export default function Configuracoes(){

    const [active_Screen, setActiveScreen] = useState("Perfil")
    const [screen_element, setScreen_element] = useState<any>(<Perfil/>)
    const Screens = 
        [
        {name:"Perfil",component:<Perfil/>},
        {name:"Privacidade",component:<Privacy/>},
        {name:"Conta",component:<Account/>}
        ]
    
    const choose_screen = (Screen:string)=>{
        setActiveScreen(Screen)
        setScreen_element(Screens.find(screen=>screen.name===Screen)?.component)
    }

    const screen_selector = ()=>{
        return(
            <div className="screen_selector">
            {Screens.map(screen => (
                <button
                key={screen.name}
                className={`screen_item${active_Screen === screen.name ? " active" : ""}`}
                onClick={() => choose_screen(screen.name)}
                >
                {screen.name}
                </button>
            ))}
            </div>
        )
    }

    return(
        <div className="Configuration_Container">
            <div className="top">
                <NavbarPrincipal/>
            </div>
            <div className="Main_Content">
                {screen_selector()}
                <div className="screen">
                    {screen_element}
                </div>
            </div>
        </div>
    )
}