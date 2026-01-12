import { useState } from "react";
import template from "../assets/img/template_image.jpg"
import { RxDotsHorizontal } from "react-icons/rx";
import GerenciarPost from "./GerenciarPost";

interface PostProps {
    nome:string,
    email:string,
    date:string,
    status:string
}
const Perfil_Post_View : React.FC<PostProps> = ({nome,email,date,status}) => {
    const [showManage, setShowManage] = useState(false)
    const Post_Status = ()=>{
        let classname = "perf-Post_Status"
        switch (status) {
            case "PERDIDO":
                classname += " lost"
                break;
            case "ENCONTRADO":
                classname += " found"
                break;
            case "ADOÇÃO":
                classname += " adoption"
                break;
            default:
                classname += ""
                break;
        }
        return(
            <div className={classname}>
                <p className="perf-Post_Status_text">{status ? status : "Status"}</p>
            </div>
        )
    }
    const show_manage = ()=>{
        document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        setShowManage(true)
    }
    return(
        <div className="perf-Perfil_Post">
            <div className="perf-row">
                <img src={template} alt="" className="perf-post_view" />
                <div className="perf-column_start">
                    <p className="perf-post_view_text">{nome ? nome : "Nome"}</p>
                    <p className="perf-small">{date ? date : "X"} dias atras</p>
                </div>
            </div>
            <div className="perf-row" style={{justifyContent:"flex-end"}}>
                {Post_Status()}
                <button className="perf-dots"><RxDotsHorizontal style={{fontSize:"1.5em"}} onClick={()=>show_manage()}/></button>
            </div>
            {showManage && <GerenciarPost setShowManage={setShowManage}/>}
        </div>
    )
}

export default Perfil_Post_View