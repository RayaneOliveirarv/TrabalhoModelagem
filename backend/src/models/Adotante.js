import PessoaFisica from "./PessoaFisica.js";

class Adotante extends PessoaFisica {
  constructor(nome, cpf) {
    super(nome, cpf);
    this.favoritos = [];
    this.animaisAdotados = [];
  }

  favoritarAnimal() {}
  removerAnimaldosFavoritos() {}
  enviarFormularioAdocao() {}
  baixarDocumentoAdocao() {}
  consultarStatusAdocao() {}
}

export default Adotante;
