export default function Account(){
    return(
        <div className="Account">
            <p><b>Gerenciar Conta</b></p>
            <div className="Content">
                <div>
                    <p><b>Exportar dados</b></p>
                    <p className="fade">Baixe uma cópia de todos os seus dados da plataforma</p>
                    <button className="submit_btn">Baixar</button>
                </div>
                <hr className="thin_border"/>
                <div>
                    <p><b>Excluir conta</b></p>
                    <p className="fade">Essa ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos</p>
                    <button className="submit_btn" style={{backgroundColor:"red"}}>Apagar</button>
                </div>
                <hr className="thin_border"/>
            </div>
        </div>
    )
}