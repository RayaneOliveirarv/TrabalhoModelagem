import {useState,useEffect} from "react";
import template from "../assets/img/template_image.jpg";
export default function Login_Register_Screen() {
    //O fundo da tela muda no JS pra acessar diretamente o body
    useEffect(() => {
    document.body.style.background = "#eaeffd";
    },[]);

    const [mode, setMode] = useState("login");
    const [class_btns, setClass_btns] = useState({
        login:   "full pad_btn borderless btn_active",
        register:"full pad_btn borderless"
    });

    const select_mode = (mode:string)=>{
        setMode(mode);

        setClass_btns({
            login: mode === "login" ? "full pad_btn borderless btn_active" : "full pad_btn borderless",
            register: mode === "register" ? "full pad_btn borderless btn_active" : "full pad_btn borderless"
        });
    }


    const Login = () => {
        return (
            <div className="Data Login">
                <p><b>LOGIN</b></p>
                <p>Junte-se a nós e ajude a salvar vidas</p>

                <div className="Input_Container">
                    <p><b>Email</b></p>
                    <input className="Input_p thin_border" type="email" name="" id="" />
                </div>
                <div className="Input_Container">
                    <p><b>senha</b></p>
                    <input className="Input_p thin_border" type="password" name="" id="" />
                </div>
                <div className="row_spaced_flex">
                    <button className="pad_btn borderless blue_button"><b>Entrar</b></button>
                    <button className="pad_btn transparent borderless">Esqueci minha senha</button>
                </div>
            </div>
        )
    }

    const Register = () => {
        return (
            <div className="Data Login">
                <p><b>Criar Conta</b></p>
                <p>Junte-se a nós e ajude a salvar vidas</p>

                <div className="Input_Container">
                    <p><b>Nome Completo</b></p>
                    <input className="Input_p thin_border" type="text" name="" id="" />
                </div>
                <div className="Input_Container">
                    <p><b>Email</b></p>
                    <input className="Input_p thin_border" type="email" name="" id="" />
                </div>
                <div className="Input_Container">
                    <p><b>Senha</b></p>
                    <input className="Input_p thin_border" type="password" name="" id="" />
                </div>
                <div className="Input_Container">
                    <p><b>Confirmar senha</b></p>
                    <input className="Input_p thin_border" type="password" name="" id="" />
                </div>
                <button className="small pad_btn borderless blue_button"><b>Confirmar</b></button>
            </div>
        )
    }
    return (
        <div className="Login_Register_Container">
            {/*TODO: Mudar essa imagem quando tiver a logo*/}
            <div className="Apresentation">
                <img className="round_image" src={template} alt="OLPET_LOGO"></img>
                <p>OLPET</p>
                <p>Encontre animais perdidos e ajude os sem lar</p>
                <div className="Mode_Selection">
                    <button className={class_btns.login} onClick={() => select_mode("login")}>Entrar</button>
                    <button className={class_btns.register} onClick={() => select_mode("register")}>Registrar</button>
                </div>
            </div>

            {mode === "login" && Login()}
            {mode === "register" && Register()}
        </div>
    );
}