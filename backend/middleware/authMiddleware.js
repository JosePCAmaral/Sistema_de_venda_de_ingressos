const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido ou expirado" });
    }
};

exports.checkAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: "Acesso negado" });
    }

    res.locals.isAdmin = req.user.isAdm;
    next();
};