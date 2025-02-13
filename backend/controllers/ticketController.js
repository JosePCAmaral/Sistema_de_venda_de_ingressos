const Ticket = require('../models/Ticket');

// Criar um ingresso (somente admin)
exports.createTicket = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Acesso negado' });
    try {
        const { name, price, quantity } = req.body;
        const ticket = new Ticket({ name, price, quantity });
        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar ingresso' });
    }
};

// Listar ingressos
exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar ingressos' });
    }
};

// Comprar ingressos
exports.buyTicket = async (req, res) => {
    try {
        const { ticketId, quantity } = req.body;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return res.status(404).json({ message: 'Ingresso não encontrado' });

        if (ticket.quantity < quantity) return res.status(400).json({ message: 'Estoque insuficiente' });
        ticket.quantity -= quantity;
        await ticket.save();

        res.json({ message: 'Compra realizada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao comprar ingresso' });
    }
};
