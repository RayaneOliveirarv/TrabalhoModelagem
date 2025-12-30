import PessoaFisica from "./PessoaFisica.js";

class ProtetorIndividual extends PessoaFisica {
  constructor(nome, cpf, historia, contato, localizacao) {
    super(nome, cpf);
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

export default ProtetorIndividual;
