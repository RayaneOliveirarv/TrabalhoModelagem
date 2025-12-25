import Usuario from "./Usuario.js";

class Administrador extends Usuario {
  constructor(id, email, senha, permissao) {
    super(id, email, senha);
    this.permissao = permissao;
  }

  aprovarUsuario() {}
  bloquearUsuario() {}
  moderarConteudo() {}
}

export default Administrador;
