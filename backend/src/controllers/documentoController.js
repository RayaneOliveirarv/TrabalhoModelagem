import db from "../config/db.js";
import { gerarPDFAdocao } from "../utils/gerarPDF.js";
import path from "path";

export const gerarDocumentoAdocao = (req, res) => {
  const { documentoId } = req.params;

  const sql = `
    SELECT d.id, a.nome AS animal, a.especie, u.email AS adotante
    FROM documentos_adocao d
    JOIN animais_adocao a ON d.animal_id = a.id
    JOIN usuarios u ON d.adotante_id = u.id
    WHERE d.id = ?
  `;

  db.query(sql, [documentoId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ mensagem: "Documento não encontrado" });

    const dados = results[0];
    const nomeArquivo = `adocao_${documentoId}.pdf`;

    gerarPDFAdocao(dados, nomeArquivo);

    db.query(
      "UPDATE documentos_adocao SET arquivo_pdf = ? WHERE id = ?",
      [nomeArquivo, documentoId]
    );

    res.json({
      mensagem: "PDF gerado com sucesso",
      arquivo: nomeArquivo
    });
  });
};

export const baixarDocumento = (req, res) => {
  const { nome } = req.params;
  const caminho = path.resolve("uploads/documentos", nome);

  res.download(caminho);
};
