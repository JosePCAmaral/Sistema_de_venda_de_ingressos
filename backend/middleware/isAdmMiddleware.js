const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Acesso negado. Token não fornecido corretamente." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        if (!user.isAdm) {
            return res.status(403).json({ message: "Acesso negado. Apenas administradores podem realizar esta ação." });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado." });
    }
};

module.exports = isAdmin;