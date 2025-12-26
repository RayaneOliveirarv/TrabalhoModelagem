import db from "../config/db.js";
import Status from "../models/enum/Status.js";
import StatusFormulario from "../models/enum/StatusFormulario.js";

// Adotante envia formulário de adoção
export const enviarFormulario = (req, res) => {
  const { adotante_id, animal_id, justificativa } = req.body;

  const sqlForm = `
    INSERT INTO formularios_adocao (adotante_id, animal_id, justificativa, status, data_envio)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(
    sqlForm,
    [adotante_id, animal_id, justificativa, StatusFormulario.ENVIADO],
    (err, result) => {
      if (err) return res.status(500).json(err);

      // Atualizar status do animal para Em_Analise
      const sqlAnimal = `UPDATE animais_adocao SET status = ? WHERE id = ?`;
      db.query(sqlAnimal, [Status.EM_ANALISE, animal_id], (err2) => {
        if (err2) return res.status(500).json(err2);

        res.status(201).json({
          mensagem: "Formulário enviado e animal em análise",
          formularioId: result.insertId
        });
      });
    }
  );
};

// Admin/ONG aprova ou rejeita formulário
export const aprovarRejeitarFormulario = (req, res) => {
  const { id } = req.params; // id do formulário
  const { acao } = req.body; // "aprovar" ou "rejeitar"

  const sqlBuscar = "SELECT * FROM formularios_adocao WHERE id = ?";
  db.query(sqlBuscar, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ mensagem: "Formulário não encontrado" });

    const formulario = results[0];
    let statusFormulario, statusAnimal;

    if (acao === "aprovar") {
      statusFormulario = StatusFormulario.APROVADO;
      statusAnimal = Status.ADOTADO; // enum usado
    } else if (acao === "rejeitar") {
      statusFormulario = StatusFormulario.REJEITADO;
      statusAnimal = Status.DISPONIVEL; // enum usado
    } else {
      return res.status(400).json({ mensagem: "Ação inválida" });
    }

    // Atualiza status do formulário
    const sqlAtualizaForm = "UPDATE formularios_adocao SET status = ? WHERE id = ?";
    db.query(sqlAtualizaForm, [statusFormulario, id], (err2) => {
      if (err2) return res.status(500).json(err2);

      // Atualiza status do animal
      const sqlAtualizaAnimal = "UPDATE animais_adocao SET status = ? WHERE id = ?";
      db.query(sqlAtualizaAnimal, [statusAnimal, formulario.animal_id], (err3) => {
        if (err3) return res.status(500).json(err3);

        // Cria documento de adoção se aprovado
        if (acao === "aprovar") {
          const sqlDoc = `
            INSERT INTO documentos_adocao (animal_id, adotante_id, data)
            VALUES (?, ?, NOW())
          `;
          db.query(sqlDoc, [formulario.animal_id, formulario.adotante_id], (err4) => {
            if (err4) return res.status(500).json(err4);

            return res.json({ mensagem: "Formulário aprovado, animal adotado e documento gerado" });
          });
        } else {
          return res.json({ mensagem: "Formulário rejeitado, animal liberado" });
        }
      });
    });
  });
};
