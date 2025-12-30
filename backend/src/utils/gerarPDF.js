import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const gerarPDFAdocao = (dados, caminhoCompleto) => {
  // Pega a pasta a partir do caminho completo recebido
  const pasta = path.dirname(caminhoCompleto);

  // Garante que a pasta existe
  if (!fs.existsSync(pasta)) {
    fs.mkdirSync(pasta, { recursive: true });
  }

  const doc = new PDFDocument();
  
  // Aqui usamos o caminhoCompleto que já veio do Service
  doc.pipe(fs.createWriteStream(caminhoCompleto));

  doc.fontSize(18).text("TERMO DE ADOÇÃO DE ANIMAL", { align: "center" });
  doc.moveDown();

  // Ajuste nos nomes dos campos para bater com o FormularioModel
  doc.fontSize(12).text(`Adotante: ${dados.adotante_nome || 'Não informado'}`);
  doc.text(`Animal: ${dados.animal_nome || 'Não informado'}`);
  doc.text(`Espécie: ${dados.animal_especie || 'Não informado'}`);
  doc.text(`Data da Adoção: ${new Date().toLocaleDateString("pt-BR")}`);
  doc.moveDown();

  doc.text(
    "Declaro que me responsabilizo pelo bem-estar do animal adotado, comprometendo-me a fornecer cuidados, alimentação, abrigo e acompanhamento veterinário."
  );

  doc.moveDown(2);
  doc.text("Assinatura do Adotante: ___________________________");
  doc.moveDown();
  doc.text("Assinatura da ONG/Protetor: ___________________________");

  doc.end();

  return caminhoCompleto;
};