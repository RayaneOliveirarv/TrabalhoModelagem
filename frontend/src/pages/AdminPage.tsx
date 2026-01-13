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
                <p>id: {user.id} | email: {user.email} | <button onClick={()=>desativar_conta()}>status: {user.status_conta}</button></p>
            </div>
        )
    }

    const desativar_conta = async ()=>{
        
    }
    return(
        <div className="admin-AdminPage">
            <div className="center_content">
                 <h1>Admin Page</h1>
            <button onClick={()=>teste()}>Listar Usuários</button>
            {listUsers.map((user:any)=>{
                return ListUserItem(user)
            })}
            </div>
        </div>
    )
}