import Animal from "./Animal.js";
import Status from "./enums/Status.js";

class AnimalAdocao extends Animal {
  constructor(id, nome, idade, especie, descricao, localizacao, status) {
    super(id, nome, idade, especie, descricao, localizacao);
    this.status = status || Status.DISPONIVEL;
    this.documentoAdocao = null;
  }

  atualizarStatus() {}
  registrarAdocao() {}
}

export default AnimalAdocao;
