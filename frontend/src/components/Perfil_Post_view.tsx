import { useState } from "react";
import template from "../assets/img/template_image.jpg"
import { RxDotsHorizontal } from "react-icons/rx";
import GerenciarPost from "./GerenciarPost";

interface PerfilPostViewProps {
    id: number;
    nome: string;
    status: string;
    foto?: string;
    dataCriacao?: string;
}

const Perfil_Post_View : React.FC<PerfilPostViewProps> = (props) => {
    const [showManage, setShowManage] = useState(false)
    
    // Calcula quantos dias atrás foi criado
    const calcularDiasAtras = () => {
        if (!props.dataCriacao) return 0;
        const hoje = new Date();
        const dataCriacao = new Date(props.dataCriacao);
        const diffTime = Math.abs(hoje.getTime() - dataCriacao.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const Post_Status = ()=>{
        let classname = "perf-Post_Status"
        const statusUpper = props.status?.toUpperCase();
        switch (statusUpper) {
            case "PERDIDO":
                classname += " lost"
                break;
            case "ENCONTRADO":
                classname += " found"
                break;
            case "ADOCAO":
            case "ADOÇÃO":
                classname += " adoption"
                break;
            default:
                classname += ""
                break;
        }
        return(
            <div className={classname}>
                <p className="perf-Post_Status_text">{props.status || "Status"}</p>
            </div>
        )
    }
    
    const show_manage = ()=>{
        document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        setShowManage(true)
    }
    
    const imagemUrl = props.foto 
        ? `http://localhost:3000/${props.foto}` 
        : template;

    return(
        <div className="perf-Perfil_Post">
            <div className="perf-row">
                <img src={imagemUrl} alt={props.nome} className="perf-post_view" />
                <div className="perf-column_start">
                    <p className="perf-post_view_text">{props.nome}</p>
                    <p className="perf-small">{calcularDiasAtras()} dias atrás</p>
                </div>
            </div>
            <div className="perf-row" style={{justifyContent:"flex-end"}}>
                {Post_Status()}
                <button className="perf-dots"><RxDotsHorizontal style={{fontSize:"1.5em"}} onClick={()=>show_manage()}/></button>
            </div>
            {showManage && <GerenciarPost setShowManage={setShowManage} animalId={props.id}/>}
        </div>
    )
}

export default Perfil_Post_View