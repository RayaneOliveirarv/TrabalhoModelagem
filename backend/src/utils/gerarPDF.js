import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const gerarPDFAdocao = (dados, nomeArquivo) => {
  const pasta = path.resolve("uploads/documentos");

  if (!fs.existsSync(pasta)) {
    fs.mkdirSync(pasta, { recursive: true });
  }

  const caminho = path.join(pasta, nomeArquivo);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(caminho));

  doc.fontSize(18).text("TERMO DE ADOÇÃO DE ANIMAL", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Adotante: ${dados.adotante}`);
  doc.text(`Animal: ${dados.animal}`);
  doc.text(`Espécie: ${dados.especie}`);
  doc.text(`Data da Adoção: ${new Date().toLocaleDateString("pt-BR")}`);
  doc.moveDown();

  doc.text(
    "Declaro que me responsabilizo pelo bem-estar do animal adotado, comprometendo-me a fornecer cuidados, alimentação, abrigo e acompanhamento veterinário."
  );

  doc.moveDown(2);
  doc.text("Assinatura do Adotante: ___________________________");
  doc.moveDown();
  doc.text("Assinatura do Protetor: ___________________________");

  doc.end();

  return nomeArquivo;
};
