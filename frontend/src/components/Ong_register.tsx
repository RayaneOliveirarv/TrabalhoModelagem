import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Ong_register() {
    useEffect(() => {
    document.body.style.background = "#eaeffd";
    },[]);
    return (
    <div className="center" style={{height:"100vh"}}>
        <div className="Data Ong_Register">
            <p className="big_txt left"><b>Alterar a conta para uma conta de ONG</b></p>
            <div className="Input_Container">
                <p><b>Nome fantasia:</b></p>
                <input type="text" className="Input_p thin_border" id="" />
                <div className="dual_column">
                    <div className="full side">
                        <div className="Input_Container">
                            <p><b>CPF/CNPJ</b></p>
                            <input type="text" className="Input_p thin_border" id="" />
                        </div>
                        <div className="Input_Container">
                            <p><b>Email</b></p>
                            <input type="email" className="Input_p thin_border" id="" />
                        </div>
                        <div className="Input_Container">
                            <p><b>Endereço</b></p>
                            <input type="text" className="Input_p thin_border" id="" />
                        </div>
                    </div>
                    <div className="full side">
                        <div className="Input_Container">
                            <p><b>Nome responsável</b></p>
                            <input type="text" className="Input_p thin_border" id="" />
                        </div>
                        <div className="Input_Container">
                            <p><b>Contato</b></p>
                            <input type="text" className="Input_p thin_border" id="" />
                        </div>
                        <div className="Input_Container">
                            <p></p>
                            <input type="text" className="Input_p thin_border" id="" />
                        </div>
                    </div>
                </div>
                <div className="row_spaced_flex">
                    <div className="Textarea_Container">
                        <p><b>Motivação da organização</b></p>
                        <textarea className="Textarea_p thin_border" id=""></textarea>
                    </div>
                    <div className="center" style={{marginTop:"2vh"}}>
                    <button className="submit_btn borderless">Enviar</button>
                    </div>
                </div>
            </div>
    </div>
    </div>
);
}