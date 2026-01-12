import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
const Perfil: React.FC = ()=>{
    const [data,setData] = useState({
        nome:"",
        sobrenome:"",
        email:"",
        telefone:"",
    })
    const {updateUser} = useAuth();
    const on_submit = (e:any,data:any)=>{
        e.preventDefault();
        const submit_data = {
            nome:data.nome + " " + data.sobrenome,
            email:data.email
        }
        
        
        updateUser(submit_data)
    }

    return(
        <form className="conf-Perfil" onSubmit={(e)=>{on_submit(e,data);}}>
            <p><b>Informações Pessoais</b></p>
            <div className="conf-Content">
                <div className="conf-row">
                    <div className="conf-Input_Container">
                    <p><b>Nome:</b></p>
                    <input type="text" className="conf-Input_p conf-thin_border" onChange={(e)=>setData({...data,nome:e.target.value})} style={{width:"100%"}}/>
                </div>
                <div className="conf-Input_Container">
                    <p><b>Sobrenome:</b></p>
                    <input type="text" className="conf-Input_p conf-thin_border" onChange={(e)=>setData({...data,sobrenome:e.target.value})} style={{width:"100%"}}/>
                </div>
                </div>
                <div className="conf-Input_Container">
                    <p><b>Email:</b></p>
                    <input type="email" className="conf-Input_p conf-thin_border" onChange={(e)=>setData({...data,email:e.target.value})}/>
                </div>
                <div className="conf-Input_Container">
                    <p><b>Telefone:</b></p>
                    <input type="text" className="conf-Input_p conf-thin_border" onChange={(e)=>setData({...data,telefone:e.target.value})} />
                </div>

                <div className="conf-row">
                    <div className="conf-Input_Container">
                        <p><b>Cidade:</b></p>
                        <input type="text" className="conf-Input_p conf-thin_border"/>
                    </div>
                    <div className="conf-Input_Container">
                        <p><b>Estado</b></p>
                        <input type="text" className="conf-Input_p conf-thin_border"/>
                    </div>
                </div>
            </div>
            <button type="submit" className="conf-submit_btn">Salvar</button>
        </form>
    )
}
export default Perfil;