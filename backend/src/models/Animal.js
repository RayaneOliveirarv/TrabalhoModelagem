class Animal {
  constructor(id, nome, idade, especie, descricao, localizacao) {
    if (this.constructor === Animal) {
      throw new Error("Animal é uma classe abstrata");
    }
    this.id = id;
    this.nome = nome;
    this.idade = idade;
    this.especie = especie;
    this.descricao = descricao;
    this.localizacao = localizacao;
  }
}

export default Animal;
