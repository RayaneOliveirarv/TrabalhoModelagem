interface FormAdocProps<T> {
    setShow:React.Dispatch<React.SetStateAction<T>>
}
import "../styles/FormAdoc/FormAdoc.css";
const FormAdoc:React.FC<FormAdocProps<any>> = ({setShow}) => {
    return(
        <div className="ForAdo-FormAdoc_cont">
            <div className="ForAdo-FormAdoc_content">
                <div className="ForAdo-FormAdoc_header">
                    <h1>Formulário de Adoção</h1>
                    <div className="ForAdo-Close">
                        <button onClick={()=>setShow(false)}>X</button>
                    </div>
                </div>
                
                <div className="ForAdo-Input_Container">
                    <p>
                        Nome Completo:
                    </p>
                    <input type="text"/>
                </div>

                <div className="ForAdo-row">
                    <div className="ForAdo-Input_Container">
                        <p>
                            CPF:
                        </p>
                        <input type="text"/>
                    
                    </div>
                    <div className="ForAdo-Input_Container">
                        <p>
                            Telefone:
                        </p>
                        <input type="text"/>
                    </div>
                </div>

                <div className="ForAdo-Input_Container">
                    <p>
                        Email:
                    </p>
                    <input type="email"/>
                </div>
                <div className="ForAdo-Input_Container">
                    <p>
                        Endereço:
                    </p>
                    <input type="text"/>
                </div>

                <div className="ForAdo-row">
                    <div className="ForAdo-Input_Container">
                        <p>
                            Cidade:
                        </p>
                        <input type="text"/>
                    </div>
                    <div  className="ForAdo-Input_Container">
                        <p>
                            Estado:
                        </p>
                        <input type="text"/>
                    </div>
                        <div className="ForAdo-Input_Container">
                        <p>
                            CEP:
                        </p>
                        <input type="text"/>
                    </div>
                </div>
            </div>
            <div className="ForAdo-Buttons_container">
                <button className="ForAdo-btn" onClick={()=>setShow(false)}>
                    Cancelar
                </button>
                <button className="ForAdo-btn black">
                    Enviar
                </button>
            </div>
        </div>
    )
}

export default FormAdoc;