const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Cadastro de usuário
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Usuário já existe" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, isAdm: false });
        await user.save();

        res.status(201).json({ message: "Usuário cadastrado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" });
    }
};

exports.registerAdm = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Usuário já existe" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, isAdm: true });
        await user.save();

        res.status(201).json({ message: "Administrador cadastrado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" });
    }
};

// Login de usuário
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdm }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};