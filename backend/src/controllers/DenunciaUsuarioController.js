import db from "../config/db.js";

export const denunciarUsuario = async (req, res) => {
  try {
    const { usuario_denunciado_id, denunciante_id, motivo } = req.body;

    // 1. Verificar se o denunciante está ATIVO
    const [denunciante] = await db.promise().query(
      "SELECT status_conta FROM usuarios WHERE id = ?", [denunciante_id]
    );

    if (!denunciante[0] || denunciante[0].status_conta !== 'Ativo') {
      return res.status(403).json({ 
        erro: "Sua conta precisa estar Ativa para realizar denúncias." 
      });
    }

    // 2. Prosseguir com a denúncia se estiver ativo
    const sql = "INSERT INTO denuncias_usuarios (usuario_denunciado_id, denunciante_id, motivo) VALUES (?, ?, ?)";
    await db.promise().query(sql, [usuario_denunciado_id, denunciante_id, motivo]);

    res.status(201).json({ mensagem: "Denúncia enviada com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};