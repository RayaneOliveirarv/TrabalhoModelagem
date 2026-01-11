import "../styles/Perfil_Page/Perf-style.css";
import Perfil_Post_View from "./Perfil_Post_view";
const MeusPosts : React.FC = () => {
    return(
        <div className="SelectedContent">
            <Perfil_Post_View/>
        </div>
    )
}

export default MeusPosts;