class Pessoa {
  constructor(nome) {
    if (this.constructor === Pessoa) {
      throw new Error("Pessoa é uma classe abstrata");
    }
    this.nome = nome;
  }
}

export default Pessoa;
