import { useEffect } from "react";
import template from "../assets/img/template_image.jpg";
export default function Feed(){
    useEffect(() => {
        document.body.style.background = "#eaeffd";
        },[]);

    //Mais só um template, pode ser que tenha que ser implementado externamente a esse arquivo
    const feed_Posts = []
    const Post = (Post_type : string)=>{
        if (Post_type != "Perdido" && Post_type != "Para Adoção" && Post_type != "Encontrado")
            return 
            
        return(
            <div className="PostContainer">
                <div className="PostHeader">
                    <img src="" alt="" />
                    <button className={Post_type}>{Post_type}</button>
                </div>
                <div className="PostContent">

                </div>
                <div className="PostMetrics">

                </div>
            </div>
        )
    }
    const Feed = ()=>{

        }
    return(
        <div>
            <div className="Docker">
                <div className="Docker_img">
                    <img src={template} className="round_image" style={{width:"9%"}} alt="User Image" />
                </div>

                <div className="Docker_item">
                    <img src="" alt="" className="Docker_icon" />
                    <p>Adoção</p>
                </div>
                <div className="Docker_item">
                    <img src="" alt="" className="Docker_icon" />
                    <p>Perfil</p>
                </div>
                <div className="Docker_item">
                    <img src="" alt="" className="Docker_icon" />
                    <p>Configurações</p>
                </div>
            </div>
            
            <div className="Content">
                <div className="ContentHeader">
                    <input type="text" name="" id="" />
                    <button>+ Novo Post</button>
                    <div className="row_spaced_flex white_box" style={{width:"50%",margin:"auto"}}>
                        <button className="full pad_btn borderless">Todos</button>
                        <button className="full pad_btn borderless">Perdidos</button>
                        <button className="full pad_btn borderless">Encontrados</button>
                        <button className="full pad_btn borderless">Adoção</button>
                    </div>
                </div>
            </div>
        </div>
    )
}