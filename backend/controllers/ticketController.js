const mongoose = require("mongoose");
const Ticket = require('../models/Ticket');
const Purchase = require("../models/Purchase");

// Criar um ingresso (somente admin)
exports.createTicket = async (req, res) => {
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

exports.buyTicket = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { ticketId, quantity } = req.body;
        const userId = req.user.id;

        const ticket = await Ticket.findById(ticketId).session(session);
        if (!ticket) return res.status(404).json({ message: "Ingresso não encontrado" });

        if (ticket.quantity < quantity) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Estoque insuficiente" });
        }

        const totalPrice = ticket.price * quantity;

        const purchase = new Purchase({
            userId,
            purchaseId: new mongoose.Types.ObjectId(),
            items: [{ ticketId, quantity }],
            totalPrice
        });

        await purchase.save({ session });
        ticket.quantity -= quantity;
        await ticket.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Compra realizada com sucesso", purchase });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Erro ao comprar ingresso", error });
    }
};

