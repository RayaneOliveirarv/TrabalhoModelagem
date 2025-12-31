class DocumentoAdocao {
  constructor(id, arquivoPDF, adotanteID) {
    this.id = id;
    this.arquivoPDF = arquivoPDF;
    this.data = new Date();
    this.adotanteID = adotanteID;
  }

  gerarDocumento() {}
  enviarPorEmail() {}
  baixarPDF() {}
}

export default DocumentoAdocao;
