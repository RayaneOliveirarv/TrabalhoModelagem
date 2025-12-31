import Pessoa from "./Pessoa.js";

class ONG extends Pessoa {
  constructor(nome, razaoSocial, cnpj, historia, contato, localizacao) {
    super(nome);
    this.razaoSocial = razaoSocial;
    this.cnpj = cnpj;
    this.historia = historia;
    this.contato = contato;
    this.localizacao = localizacao;
  }

  cadastrarAnimal() {}
  editarAnimal() {}
  removerAnimal() {}
  avaliarCandidato() {}
  reportarAnimalPerdido() {}
}

export default ONG;
