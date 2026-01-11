const Perfil: React.FC = ()=>{

    return(
        <div className="conf-Perfil">
            <p>Informações Pessoais</p>
            <div className="conf-Content">
                <div className="conf-row">
                    <div className="conf-Input_Container">
                    <p><b>Nome:</b></p>
                    <input type="text" className="conf-Input_p conf-thin_border" id="" style={{width:"100%"}}/>
                </div>
                <div className="conf-Input_Container">
                    <p><b>Sobrenome:</b></p>
                    <input type="text" className="conf-Input_p conf-thin_border" id="" style={{width:"100%"}}/>
                </div>
                </div>
                <div className="conf-Input_Container">
                    <p><b>Email:</b></p>
                    <input type="email" className="conf-Input_p conf-thin_border" id=""/>
                </div>
                <div className="conf-Input_Container">
                    <p><b>Telefone:</b></p>
                    <input type="text" className="conf-Input_p conf-thin_border" id="" />
                </div>

                <div className="conf-row">
                    <div className="conf-Input_Container">
                        <p><b>Cidade:</b></p>
                        <input type="text" className="conf-Input_p conf-thin_border"/>
                    </div>
                    <div className="conf-Input_Container">
                        <p><b>Estado</b></p>
                        <input type="text" className="conf-Input_p conf-thin_border"/>
                    </div>
                </div>
            </div>
            <button className="conf-submit_btn">Salvar</button>
        </div>
    )
}
export default Perfil;