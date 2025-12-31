// Importa a configuração da conexão com o banco de dados
import db from "../config/db.js";

/**
 * Função para registrar uma denúncia contra um usuário.
 * Este processo é importante para a moderação e saúde da plataforma.
 */
export const denunciarUsuario = async (req, res) => {
  try {
    // Extrai os IDs e o motivo do corpo da requisição (JSON enviado pelo front-end)
    const { usuario_denunciado_id, denunciante_id, motivo } = req.body;

    // --- PASSO 1: Validação de Segurança ---
    // Verifica se quem está denunciando (denunciante) tem uma conta ativa.
    // Isso impede que contas suspensas ou inexistentes tentem prejudicar outros usuários.
    const [denunciante] = await db.promise().query(
      "SELECT status_conta FROM usuarios WHERE id = ?", [denunciante_id]
    );

    // Se o usuário não for encontrado ou o status não for exatamente 'Ativo'
    if (!denunciante[0] || denunciante[0].status_conta !== 'Ativo') {
      return res.status(403).json({ 
        erro: "Sua conta precisa estar Ativa para realizar denúncias." 
      });
    }

    // --- PASSO 2: Registro da Denúncia ---
    // Se passou na validação acima, prosseguimos com a inserção na tabela de denúncias.
    const sql = "INSERT INTO denuncias_usuarios (usuario_denunciado_id, denunciante_id, motivo) VALUES (?, ?, ?)";
    
    // Executa o comando SQL usando as variáveis recebidas com segurança (evita SQL Injection)
    await db.promise().query(sql, [usuario_denunciado_id, denunciante_id, motivo]);

    // Retorna status 201 (Criado) confirmando que o processo deu certo
    res.status(201).json({ mensagem: "Denúncia enviada com sucesso." });

  } catch (err) {
    // Em caso de qualquer erro de servidor ou banco, retorna o erro 500
    res.status(500).json({ erro: err.message });
  }
};