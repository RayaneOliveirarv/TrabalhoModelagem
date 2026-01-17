import { listarUsuarios } from "../contexts/AuthContext"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "../styles/AdminPage/AdminPage.css"

export default function AdminPage(){
    const[selected_user, setSelected_user] = useState<any>({});
    const[listUsers, setListUsers] = useState([{}]);

    const[show_list, setShow_list] = useState(false);
    const[show_dialog, setShow_dialog] = useState(false);
    const[show_confirm, setShow_confirm] = useState(false);
    const[show_alert, setShow_alert] = useState(false);

    const[user_classname, setUser_classname] = useState("admin-text");
    const[Alert_props, setAlert_props] = useState({animation:"slide-up",animation_time:0.3});

    const[motive, setMotive] = useState("");
    const[action, setAction] = useState("Bloqueado");
    const[ServerResolveMessage, setServerResolveMessage] = useState("teste");

    const navigator = useNavigate();

    const handleSelectUser = (user:any)=>{
        setSelected_user(user);
        setShow_dialog(true);
        
        console.log(selected_user.status_conta);
        if(user.status_conta === "Ativo"){
            setUser_classname("admin-text ativo");
            }
            else if(user.status_conta === "Pendente"){
                setUser_classname("admin-text pendente");
            }
            else{
                setUser_classname("admin-text bloqueado");
            }
    }
    const handle_remove = async ()=>{
        const res = await api.deletarConta(selected_user.id);
        setServerResolveMessage(res.mensagem);
        setShow_confirm(false);
        setShow_dialog(false);
        List_Users();
        handle_show_alert(2000,0.5);
    }
    const handle_update_user = async ()=>{
        try{
            const res = await api.moderarConta(selected_user.id, action,motive);
            setServerResolveMessage(res.mensagem);
            setShow_dialog(false);
            setAction("Bloqueado");
            List_Users();
            handle_show_alert(2000,0.5);
        }
        catch(err:any)
        {
            setServerResolveMessage(err.erro ?? err.message);
            setShow_dialog(false);
            handle_show_alert(2000,0.5);
        }
    }
    const dialog = ()=>{
        return(
            <div className="admin-dialog">
            {
                show_confirm ?
                <div   style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                    <p style={{color:"black"}}>Tem certeza que deseja excluir essa conta?</p>
                    <div>
                        <button className="admin-btn" onClick={()=>setShow_confirm(false)}>Cancelar</button>
                        <button className="admin-btn" onClick={()=>handle_remove()}>Confirmar</button>
                    </div>
                </div>
                :
                <div>
                    <div className="admin-input_Container">
                        <div className={user_classname}>
                            <p>Status atual da conta do usuário:{selected_user.status_conta}</p>
                        </div>
                        <p>Alterar Estado da Conta</p>
                        <select onChange={(e)=>setAction(e.target.value)}>
                            <option value="Bloqueado">Bloqueado</option>
                            <option value="Ativo">Ativo</option>
                            <option value="Pendente">Pendente</option>
                        </select>
                        <p>Motivo:</p>
                        <textarea onChange={(e)=>setMotive(e.target.value)}/>
                    </div>
                    
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                        <button className="admin-btn remove_account" onClick={()=>setShow_confirm(true)}>Excluir Conta do usuário</button>
                    <div>
                        <button className="admin-btn" onClick={()=>setShow_dialog(false)}>Cancelar</button>
                        <button className="admin-btn" onClick={()=>handle_update_user()}>Confirmar</button>
                    </div>
                    </div>
                </div>
                }
            </div> 
        )
    }

    const handle_show_alert = (message_time:number, anim_time=0.3)=>{
        let time = (anim_time*2*1000) + message_time;
        let one_anim_time = anim_time*1000;
        
        setShow_alert(true);

        setTimeout(() => {
            setAlert_props({animation:"slide-down", animation_time:anim_time});
        },one_anim_time + message_time);

        setTimeout(() => {
            setShow_alert(false);
            setAlert_props({animation:"slide-up", animation_time:anim_time});

        },time);
    }

    const alert = ()=>{
        return(
            <div className="admin-alert" style={{animation: `${Alert_props.animation} ${Alert_props.animation_time}s ease-in-out`}}>
                <p>{ServerResolveMessage}</p>
            </div>
        )
    }

    const List_Users = async ()=>{
        const response = await listarUsuarios();
        setShow_list(true);
        setListUsers(response);
    }

    const ListUserItem = (user:any)=>{
        return(
            <div className="user_item" key={user.id}>
                    <div className="admin-row">
                        <div className="admin-column_start">
                            <span className="admin-user_data">ID de usuário: {user.id}</span>
                            <span className="admin-user_data">email: {user.email} </span>
                            <span className="admin-user_data">
                                status: {user.status_conta}
                            </span>
                        </div>
                        <button className="admin-btn"  onClick={()=>handleSelectUser(user)}>Gerenciar Conta</button>
                    </div>
                
            </div>
        )
    }

    return(
        <div className="admin-AdminPage">
            <div className="center_content">
                <div className="admin-row">
                    <div className="admin-title">
                     <h1>Painel do Administrador</h1>
                    <button onClick={()=>List_Users()} className="admin-btn">Listar Usuários</button>
                 </div>
                 <button className="admin-btn" onClick={()=>navigator("/")}>Voltar</button>
                </div>
                
                <div className="admin-selected_content">   
                {
                show_dialog 
                ? 
                    dialog() 
                :
                    show_list 
                    ? 
                        listUsers.map((user:any)=>{
                            return ListUserItem(user)
                        })
                    : 
                        <div className="admin-gen_container">
                            <p className="admin-advice">Clique em Listar usuários para visualizar a lista de usuários cadastrados no sistema</p>
                        </div>
                }
                </div>
            {
                show_alert && alert()
            }
            </div>
        </div>
    )
}