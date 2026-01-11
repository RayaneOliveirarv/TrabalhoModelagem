import "../styles/Perfil_Page/Perf-style.css";
import { FaUpload } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
interface GerenciarPostProps {
    setShowManage: React.Dispatch<React.SetStateAction<boolean>>
}

const GerenciarPost : React.FC<GerenciarPostProps> = ({setShowManage}) => {
    return(
        <div className="perf-GerenciarPost">
            <div className="perf-row">
                <p><b>Editar/excluir post</b></p>
                <button className="perf-dots" style={{borderRadius:"50%",textAlign:"center"}} onClick={()=>setShowManage(false)}><IoCloseSharp/></button>
            </div>
            <div className="Input_Container">
                <p>Nome do animal:</p>
            <input type="text" className="perf-Input_p thin_border" />
            </div>
            <div className="Input_Container">
                <p>Tipo do animal:</p>
            <select name="animal" className="perf-select_p thin_border">
                <option value="Felino">Felino</option>
                <option value="Canino">Canino</option>
                <option value="Ave">Ave</option>
                <option value="Exótico">Exótico</option>
            </select>
            </div>
            <div className="Input_Container">
                <p>Estado do animal:</p>
            <select name="animal" className="perf-select_p thin_border">
                <option value="Perdido">Perdido</option>
                <option value="Encontrado">Encontrado</option>
                <option value="Para Adoção">Para Adoção</option>
            </select>
            </div>
            <div className="Input_Container">
                <p>Localização:</p>
            <input type="text" className="perf-Input_p thin_border" />
            </div>
            <div className="Input_Container">
                <p>Descrição:</p>
            <textarea name="description" className="perf-textarea_p" id=""></textarea>
            </div>
            <div className="Input_Container">
                <p>Upload img:</p>
            <FaUpload style={{fontSize:"1.5em"}}/> <input type="file" className="perf-FileInput"/>

            <div className="perf-row">
                <button className="perf-Button">Atualizar</button>
                <button className="perf-Button perf-red">Excluir post</button>
            </div>
            </div>
        </div>
    )
}

export default GerenciarPost;