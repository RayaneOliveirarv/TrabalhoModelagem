const Privacy:React.FC = ()=>{
    return(
        <div className="conf-Privacidade">
            <p><b>Privacidade e segurança</b></p>
            <p>Alterar a senha</p>
            <hr />
            <div className="conf-Content conf-row">
                <div>
                    <div className="conf-Input_Container">
                        <p><b>Senha atual:</b></p>
                        <input type="password" className="conf-Input_p conf-thin_border" id="" />
                    </div>
                    <div className="conf-Input_Container">
                        <p><b>Nova senha:</b></p>
                        <input type="password" className="conf-Input_p conf-thin_border" id="" />
                    </div>
                    <div className="conf-Input_Container">
                        <p><b>Confirmar nova senha:</b></p>
                        <input type="password" className="conf-Input_p conf-thin_border" id="" />
                    </div>
                </div>
                <button className="conf-submit_btn" style={{alignSelf:"end"}}>Atualizar Senha</button>                
            </div>
            <hr />
        </div>
    )
}
export default Privacy;