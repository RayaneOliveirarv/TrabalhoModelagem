import { listarUsuarios } from "../contexts/AuthContext"
import { useState } from "react";

import "../styles/AdminPage/AdminPage.css"
export default function AdminPage(){
    const[listUsers, setListUsers] = useState([{}]);
    const teste = async ()=>{
        const response = await listarUsuarios();
        console.log("res: ",response)
        setListUsers(response);
    }

    const ListUserItem = (user:any)=>{
        return(
            <div className="user_item">
                <p>
                    <span className="admin-user_data">ID de usuário: {user.id}</span>  
                    <span className="admin-user_data">email: {user.email} </span>
                    <button className="admin-btn" onClick={()=>desativar_conta()}>
                        status: {user.status_conta}
                    </button>
                </p>
            </div>
        )
    }

    const desativar_conta = async ()=>{
        
    }
    return(
        <div className="admin-AdminPage">
            <div className="center_content">
                 <h1>Painel do Administrador</h1>
                <button onClick={()=>teste()} className="admin-btn">Listar Usuários</button>
                {listUsers.map((user:any)=>{
                    return ListUserItem(user)
                })}
            </div>
        </div>
    )
}