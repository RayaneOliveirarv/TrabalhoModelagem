import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Função utilitária para gerar o PDF do Termo de Adoção.
 * @param {Object} dados - Objeto contendo nomes do adotante, animal e responsável.
 * @param {string} caminhoCompleto - O local exato onde o arquivo será salvo no servidor.
 */
export const gerarPDFAdocao = (dados, caminhoCompleto) => {
  // 1. Extrai o diretório (ex: 'uploads/documentos') para garantir que ele existe
  const pasta = path.dirname(caminhoCompleto);

  // 2. Cria a pasta caso ela ainda não tenha sido criada (importante para evitar erros de escrita)
  if (!fs.existsSync(pasta)) {
    fs.mkdirSync(pasta, { recursive: true });
  }

  // 3. Inicializa o motor do PDFKit
  const doc = new PDFDocument();
  
  // 4. Cria um "tubo" (pipe) que liga o gerador de PDF diretamente ao arquivo no disco
  doc.pipe(fs.createWriteStream(caminhoCompleto));

  // --- Design do Documento ---

  // Cabeçalho Centralizado
  doc.fontSize(18).text("TERMO DE ADOÇÃO DE ANIMAL", { align: "center" });
  doc.moveDown();

  // Dados Dinâmicos (usando os campos que vêm do FormularioModel.buscarDadosParaPdf)
  doc.fontSize(12).text(`Adotante: ${dados.adotante_nome || 'Não informado'}`);
  doc.text(`Animal: ${dados.animal_nome || 'Não informado'}`);
  doc.text(`Espécie: ${dados.animal_especie || 'Não informado'}`);
  doc.text(`Data da Adoção: ${new Date().toLocaleDateString("pt-BR")}`);
  doc.moveDown();

  // Texto Jurídico/Responsabilidade
  doc.text(
    "Declaro que me responsabilizo pelo bem-estar do animal adotado, comprometendo-me a fornecer cuidados, alimentação, abrigo e acompanhamento veterinário."
  );

  // Espaço para Assinaturas
  doc.moveDown(2);
  doc.text("Assinatura do Adotante: ___________________________");
  doc.moveDown();
  doc.text("Assinatura da ONG/Protetor: ___________________________");

  // 5. Finaliza o processamento e fecha o arquivo
  doc.end();

  return caminhoCompleto;
};