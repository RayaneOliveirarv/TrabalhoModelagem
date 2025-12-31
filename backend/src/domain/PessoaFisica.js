import Pessoa from "./Pessoa.js";

class PessoaFisica extends Pessoa {
  constructor(nome, cpf) {
    super(nome);
    this.cpf = cpf;
  }
}

export default PessoaFisica;
