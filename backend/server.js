const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const User = require('./models/User');
const Purchase = require('./models/Purchase');
const Ticket = require('./models/Ticket');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar Handlebars
app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'layout' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error(err));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// 🔹 Página de Login
app.get('/login', (req, res) => {
    res.render('login');
});

// 🔹 Página de Cadastro de Usuário
app.get('/register', (req, res) => {
    res.render('register');
});

// 🔹 Página de Histórico de Compras (dados do banco)
app.get('/historico/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).send('Usuário não encontrado');

        const compras = await Purchase.find({ userId: user._id }).populate('ticketId');

        res.render('historico', { user, compras });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar histórico de compras');
    }
});

// 🔹 Página de Ingressos Disponíveis (dados do banco)
app.get('/ingressos', async (req, res) => {
    try {
        const ingressos = await Ticket.find({});
        res.render('ingressos', { ingressos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar ingressos disponíveis');
    }
});

// 🔹 Página de Detalhes do Ingresso (dados do banco)
app.get('/ingresso/:id', async (req, res) => {
    try {
        const ingresso = await Ticket.findById(req.params.id);
        if (!ingresso) return res.status(404).send('Ingresso não encontrado');

        res.render('ingresso', { ingresso });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar detalhes do ingresso');
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));