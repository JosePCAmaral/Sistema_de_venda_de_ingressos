const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const apiRoutes = require('./routes/backendRoutes');
const frontendRoutes = require('./routes/frontendRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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

app.use(apiRoutes);
app.use(frontendRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));