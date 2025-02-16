const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Cadastro de usuário
exports.register = async (req, res) => {
    try {
        console.log("Recebendo requisição de cadastro:", req.body); // <-- Log para debug

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, isAdm: false });

        await user.save();
        console.log("Usuário cadastrado com sucesso:", user); // <-- Log para debug

        res.status(201).json({ message: "Usuário cadastrado com sucesso" });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error); // <-- Log do erro
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

// Atualizar usuário
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password } = req.body;
        const { user } = req; // Obtendo usuário autenticado do middleware

        if (user.id !== id && !user.isAdm) {
            return res.status(403).json({ message: "Sem permissão para editar este usuário" });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) return res.status(404).json({ message: "Usuário não encontrado" });

        res.json({ message: "Usuário atualizado com sucesso", user: updatedUser });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ message: "Erro no servidor" });
    }
};

// Excluir usuário
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req; // Obtendo usuário autenticado do middleware

        if (user.id !== id && !user.isAdm) {
            return res.status(403).json({ message: "Sem permissão para excluir este usuário" });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) return res.status(404).json({ message: "Usuário não encontrado" });

        res.json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        res.status(500).json({ message: "Erro no servidor" });
    }
};

// Login de usuário
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Usuário não encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("Erro: JWT_SECRET não está definido no .env");
            return res.status(500).json({ message: "Erro interno no servidor" });
        }

        const token = jwt.sign(
            { id: user._id, isAdm: user.isAdm }, // Mantendo "isAdm" igual ao model
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" });

        res.json({ message: "Login bem-sucedido!", token: token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor" });
    }
};