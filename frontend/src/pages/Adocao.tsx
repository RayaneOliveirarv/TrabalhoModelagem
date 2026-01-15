import { MdEmail, MdMail } from "react-icons/md";
import api from "../services/api";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Adocao/Adocao.css";
import NavbarPrincipal from "../components/NavbarPrincipal";
import FormAdoc from "../components/FormularioAdocao";
const adocao:React.FC = () =>{
    const [animais, setAnimais] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {user} = useAuth();
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const carregarAnimais = async () => {
          try {
            const data = await api.listarAnimais();
            const adoc_data = data.filter((animal)=> animal?.categoria === 'Adocao');
            setAnimais(adoc_data);
          } catch (err: any) {
            setError('Erro ao carregar animais: ' + err.message);
          } finally {
            setLoading(false);
          }
        };
        carregarAnimais();
      }, []);

    return(
        <div className="Ado-Adocao_container">
            <NavbarPrincipal/>
            {
            showForm 
            ? 
                <FormAdoc setShow={setShowForm}/> 
            :
                <div className="Ado-feed_H_Scroll">
                        {
                        animais.map((animal)=>(
                            <div className="Ado-card" key={animal.id}>
                                <div className="Ado-tag">
                                    <p>{animal?.categoria}</p>
                                </div>
                                    <div className="Ado-card_content">
                                        <img className="Ado-card_img" src={animal.foto_url ? `http://localhost:3000/${animal.foto_url}` : 'https://images.unsplash.com/photo-1558788353-f76d92427f16'} alt={animal?.nome} />

                                        <div className="Ado-card_info">
                                            <h2 className="Ado-card_info_title">{animal?.nome}</h2>
                                            <p className="Ado-card_info_desc">{animal?.descricao}</p>
                                            <p>teste {animal.data_criacao}</p>
                                            <div className="Ado-card_info_contato">
                                                <h3>Informações de Contato</h3>
                                                {user?.nome && <p>Nome: {user?.nome}</p>}
                                                {user?.email && <p><MdMail/>Email: {user?.email}</p>}
                                            </div>
                                        </div>
                                    </div>
                                <div className="Ado-btn_cont">
                                    <button className="Ado-card_button" onClick={()=>setShowForm(true)}>Entrar em Contato</button>
                                </div>
                            </div>
                            ))
                        }        
                </div>
            }
            </div>
    )
}

export default adocao;