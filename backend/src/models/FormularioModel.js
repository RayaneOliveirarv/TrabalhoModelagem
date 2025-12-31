import db from "../config/db.js";

/**
 * FormularioModel: Gerencia o ciclo de vida das intenções de adoção.
 * Faz a ponte entre a tabela 'formularios_adocao' e as tabelas de suporte.
 */
export const FormularioModel = {
  
  // RF10: Registra o interesse inicial de um adotante por um animal.
  criar(dados) {
    const sql = `
      INSERT INTO formularios_adocao
      (adotante_id, animal_id, experiencia, ambiente, justificativa, status, data_envio)
      VALUES (?, ?, ?, ?, ?, 'Enviado', NOW())
    `;

    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          dados.adotante_id,
          dados.animal_id,
          dados.experiencia,
          dados.ambiente,
          dados.justificativa || "Interesse na adoção"
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  // Busca simples para validações rápidas no Controller
  buscarPorId(id) {
    const sql = `SELECT * FROM formularios_adocao WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  /**
   * RF18: Painel do Protetor/ONG.
   * Lista quem quer adotar os animais que pertencem a este responsável.
   * O JOIN aqui é essencial para mostrar nomes em vez de apenas IDs.
   */
  listarPorDono(tipoResponsavel, donoId) {
    const sql = `
      SELECT f.*, a.nome as animal_nome, ad.nome as adotante_nome
      FROM formularios_adocao f
      JOIN animais_adocao a ON f.animal_id = a.id
      JOIN adotantes ad ON f.adotante_id = ad.usuario_id
      WHERE a.${tipoResponsavel} = ?
      ORDER BY f.data_envio DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [donoId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // RF12: Painel do Adotante.
  // Permite que o usuário veja a lista de pets que ele tentou adotar e o status atual.
  listarPorAdotante(adotanteId) {
    const sql = `
      SELECT f.*, a.nome as animal_nome 
      FROM formularios_adocao f
      JOIN animais_adocao a ON f.animal_id = a.id
      WHERE f.adotante_id = ?
      ORDER BY f.data_envio DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [adotanteId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // Altera o estado do processo (ex: de 'Enviado' para 'Aprovado')
  atualizarStatus(id, status) {
    const sql = `UPDATE formularios_adocao SET status = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [status, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  /**
   * RF15: A "Query de Ouro" para o Documento PDF.
   * Este método reúne dados de 5 tabelas diferentes (ou contextos) em um único objeto.
   * O uso do COALESCE resolve o problema de o animal pertencer a uma ONG ou Protetor.
   */
  buscarDadosParaPdf(id) {
    const sql = `
      SELECT 
        f.id AS formulario_id,
        ad.nome AS adotante_nome,
        ad.cpf AS adotante_cpf,
        an.nome AS animal_nome,
        an.especie AS animal_especie,
        COALESCE(o.nome, p.nome) AS responsavel_nome,
        COALESCE(o.contato, p.contato) AS responsavel_contato
      FROM formularios_adocao f
      JOIN adotantes ad ON f.adotante_id = ad.usuario_id
      JOIN animais_adocao an ON f.animal_id = an.id
      LEFT JOIN ongs o ON an.ong_id = o.usuario_id
      LEFT JOIN protetores_individuais p ON an.protetor_id = p.usuario_id
      WHERE f.id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  // Registra o link final do documento gerado no disco
  salvarCaminhoDocumento(formularioId, caminho) {
    const sql = `UPDATE formularios_adocao SET documento_caminho = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [caminho, formularioId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};