export default function Perfil(){

    return(
        <div className="Perfil">
            <p>Informações Pessoais</p>
            <div className="Content">
                <div className="Input_Container">
                    <p><b>Nome:</b></p>
                    <input type="text" className="Input_p thin_border" id="" />
                </div>
                <div className="Input_Container">
                    <p><b>Sobrenome:</b></p>
                    <input type="text" className="Input_p thin_border" id="" />
                </div>
                <div className="Input_Container">
                    <p><b>Email:</b></p>
                    <input type="email" className="Input_p thin_border" id="" />
                </div>
                <div className="Input_Container">
                    <p><b>Telefone:</b></p>
                    <input type="text" className="Input_p thin_border" id="" />
                </div>

                <div className="row">
                    <div className="Input_Container">
                        <p><b>Cidade:</b></p>
                        <input type="text" className="Input_p thin_border" style={{width:"38vw"}}/>
                    </div>
                    <div className="Input_Container">
                        <p><b>Estado</b></p>
                        <input type="text" className="Input_p thin_border" style={{width:"38vw"}}/>
                    </div>
                </div>
            </div>
            <button className="submit_btn">Salvar</button>
        </div>
    )
}