import StatusFormulario from "./enums/StatusFormulario.js";

class FormularioAdocao {
  constructor(id, dadosAdotante, justificativa) {
    this.id = id;
    this.dadosAdotante = dadosAdotante;
    this.justificativa = justificativa;
    this.dataEnvio = new Date();
    this.status = StatusFormulario.ENVIADO;
  }

  enviar() {}
  validar() {}
}

export default FormularioAdocao;
