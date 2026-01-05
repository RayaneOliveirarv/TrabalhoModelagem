export default function Privacy(){
    return(
        <div className="Privacidade">
            <p><b>Privacidade e segurança</b></p>
            <p>Alterar a senha</p>
            <hr />
            <div className="Content row">
                <div>
                    <div className="Input_Container">
                        <p><b>Senha atual:</b></p>
                        <input type="password" className="Input_p thin_border" id="" />
                    </div>
                    <div className="Input_Container">
                        <p><b>Nova senha:</b></p>
                        <input type="password" className="Input_p thin_border" id="" />
                    </div>
                    <div className="Input_Container">
                        <p><b>Confirmar nova senha:</b></p>
                        <input type="password" className="Input_p thin_border" id="" />
                    </div>
                </div>
                <button className="submit_btn" style={{alignSelf:"end"}}>Atualizar Senha</button>
            </div>
            <hr />
        </div>
    )
}