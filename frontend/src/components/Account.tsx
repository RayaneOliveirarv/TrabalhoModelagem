const Account : React.FC = ()=>{
    return(
        <div className="conf-Account">
            <p><b>Gerenciar Conta</b></p>
            <div className="conf-Content">
                <div>
                    <p><b>Exportar dados</b></p>
                    <p className="conf-fade">Baixe uma cópia de todos os seus dados da plataforma</p>
                    <button className="conf-submit_btn">Baixar</button>
                </div>
                <hr className="conf-thin_border"/>
                <div>
                    <p><b>Excluir conta</b></p>
                    <p className="conf-fade">Essa ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos</p>
                    <button className="conf-submit_btn" style={{backgroundColor:"red"}}>Apagar</button>
                </div>
                <hr className="conf-thin_border"/>
            </div>
        </div>
    )
}

export default Account;