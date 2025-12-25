import Animal from "./Animal.js";
import StatusPerdido from "./enums/StatusPerdido.js";

class AnimalPerdido extends Animal {
  constructor(
    id,
    nome,
    idade,
    especie,
    descricao,
    localizacao,
    dataDesaparecimento,
    ultimaLocalizacao
  ) {
    super(id, nome, idade, especie, descricao, localizacao);
    this.dataDesaparecimento = dataDesaparecimento;
    this.ultimaLocalizacao = ultimaLocalizacao;
    this.status = StatusPerdido.PERDIDO;
  }

  reportar() {}
  atualizarInformacoes() {}
}

export default AnimalPerdido;
