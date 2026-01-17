interface FormAdocProps<T> {
    setShow:React.Dispatch<React.SetStateAction<T>>
    ids?:any
    SetMessage_classname:React.Dispatch<React.SetStateAction<T>>
    SetMessage:React.Dispatch<React.SetStateAction<T>>

}
import "../styles/FormAdoc/FormAdoc.css";
import api from "../services/api";
import { useState } from "react";

const FormAdoc:React.FC<FormAdocProps<any>> = ({setShow, ids,SetMessage_classname,SetMessage}) => {
    const [justificativa, setJustificativa] = useState("");
    const [experiencia, setExperiencia] = useState("");
    const [ambiente, setAmbiente] = useState("");
    const [error, setError] = useState("");
    const[Alert_props, setAlert_props] = useState({animation:"slide-up",animation_time:0.3});

    const on_submit = async () => {
        try {
            console.log("id do animal: ", ids.animal, "id do adotante: ", ids.user);
            await api.enviarFormulario({
                adotante_id: ids.user,
                animal_id: ids.animal,
                experiencia: experiencia,
                ambiente: ambiente,
                justificativa: justificativa
            })
            
            SetMessage_classname("sucess")
            SetMessage("Formulario enviado com sucesso!")
            setShow(false);
            setTimeout(() => {
                SetMessage("");
                SetMessage_classname("");
            }, 3000);

        } catch (err: any) {
            handle_show_alert("Obrigatório preencher todos os campos",2000);
            setTimeout(() => setError(""), 4000);
        }
    }

    const handle_show_alert = (message:string,message_time:number, anim_time=0.3)=>{
        let time = (anim_time*2*1000) + message_time;
        let one_anim_time = anim_time*1000;
        
        setError(message);

        setTimeout(() => {
            setAlert_props({animation:"slide-down", animation_time:anim_time});
        },one_anim_time + message_time);

        setTimeout(() => {
            setError("");
            setAlert_props({animation:"slide-up", animation_time:anim_time});
        },time);
    }

    const alert = ()=>{
        return(
            <div className="ForAdo-error" style={{animation: `${Alert_props.animation} ${Alert_props.animation_time}s ease-in-out`}}>
                <p>{error}</p>
            </div>
        )
    }

    return(
        <form onSubmit={(e) => {e.preventDefault(); on_submit();}}>
            <div className="ForAdo-FormAdoc_cont">
                <div className="ForAdo-FormAdoc_content">
                    <div className="ForAdo-FormAdoc_header">
                        <h1>Formulário de Adoção</h1>
                        <div className="ForAdo-Close">
                            <button onClick={()=>setShow(false)}>X</button>
                        </div>
                    </div>
            
                    <div className="ForAdo-Input_Container">
                        <p>
                            Nome Completo:
                        </p>
                        <input type="text"/>
                    </div>
                    <div className="ForAdo-row">
                        <div className="ForAdo-Input_Container">
                            <p>
                                CPF:
                            </p>
                            <input type="text"/>
            
                        </div>
                        <div className="ForAdo-Input_Container">
                            <p>
                                Telefone:
                            </p>
                            <input type="text"/>
                        </div>
                    </div>
                    <div className="ForAdo-Input_Container">
                        <p>
                            Email:
                        </p>
                        <input type="email"/>
                    </div>
                    <div className="ForAdo-Input_Container">
                        <p>
                            Endereço:
                        </p>
                        <input type="text"/>
                    </div>
                    <div className="ForAdo-row">
                        <div className="ForAdo-Input_Container">
                            <p>
                                Cidade:
                            </p>
                            <input type="text"/>
                        </div>
                        <div  className="ForAdo-Input_Container">
                            <p>
                                Estado:
                            </p>
                            <input type="text"/>
                        </div>
                            <div className="ForAdo-Input_Container">
                            <p>
                                CEP:
                            </p>
                            <input type="text"/>
                        </div>
                    </div>
                    <div className="ForAdo-row">
                        <div className="ForAdo-textarea">
                            <p>Justificativa</p>
                            <textarea placeholder="Porque gostaria de adotar" onChange={(e) => setJustificativa(e.target.value)}/>
                        </div>
                        <div className="ForAdo-textarea">
                            <p>Experiência</p>
                            <textarea placeholder="Fale sobre suas experiências com adoção" onChange={(e) => setExperiencia(e.target.value)}/>
                        </div>
                        <div className="ForAdo-textarea">
                            <p>Ambiente:</p>
                            <textarea placeholder="Fale sobre o ambiente em que o animal vai ficar" onChange={(e) => setAmbiente(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className="ForAdo-Buttons_container">
                    {error != "" && alert()}
                    <button className="ForAdo-btn" onClick={()=>setShow(false)}>
                        Cancelar
                    </button>
                    <button className="ForAdo-btn black" type="submit">
                        Enviar
                    </button>
                </div>
            </div>
        </form>
    )
}

export default FormAdoc;