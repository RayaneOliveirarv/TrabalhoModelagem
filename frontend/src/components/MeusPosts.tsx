import "../styles/Perfil_Page/Perf-style.css";
import Perfil_Post_View from "./Perfil_Post_view";

interface MeusPostsProps {
    nome:string,
    email:string,
    data_post:string,
    status:string
}
const MeusPosts : React.FC<MeusPostsProps> = ({nome,email,data_post,status}) => {
    console.log(nome,email,data_post,status)
    return(
        <div className="SelectedContent">
            <Perfil_Post_View nome={nome} email={email} date={data_post} status={status}/>
        </div>
    )
}

export default MeusPosts;