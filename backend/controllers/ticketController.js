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

// Atualizar um ingresso (somente admin)
exports.updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity } = req.body;

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            { name, price, quantity },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: "Ingresso não encontrado" });
        }

        res.json({ message: "Ingresso atualizado com sucesso", ticket: updatedTicket });
    } catch (error) {
        console.error("Erro ao atualizar ingresso:", error);
        res.status(500).json({ message: "Erro ao atualizar ingresso" });
    }
};

// Deletar um ingresso (somente admin)
exports.deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTicket = await Ticket.findByIdAndDelete(id);

        if (!deletedTicket) {
            return res.status(404).json({ message: "Ingresso não encontrado" });
        }

        res.json({ message: "Ingresso deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar ingresso:", error);
        res.status(500).json({ message: "Erro ao deletar ingresso" });
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

exports.getHomeData = async (req, res) => {
    try {
        const ingressosBaratos = await Ticket.find().sort({ price: 1 }).limit(3);
        const ingressosPoucaQtd = await Ticket.find().sort({ quantity: 1 }).limit(3);

        res.json({ ingressosBaratos, ingressosPoucaQtd });
    } catch (error) {
        console.error("Erro ao buscar ingressos:", error);
        res.status(500).json({ message: "Erro ao carregar os ingressos." });
    }
};

exports.buyTicket = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { ticketId, quantity } = req.body;
        const userId = req.user.id;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantidade inválida" });
        }

        const ticket = await Ticket.findById(ticketId).session(session);
        if (!ticket) {
            return res.status(404).json({ message: "Ingresso não encontrado" });
        }

        if (ticket.quantity < quantity) {
            return res.status(400).json({ message: "Estoque insuficiente" });
        }

        const totalPrice = ticket.price * quantity;

        const purchase = new Purchase({
            userId,
            items: [{ 
                ticketId, 
                quantity, 
                priceAtPurchase: ticket.price 
            }],
            totalPrice
        });

        await purchase.save({ session });
        ticket.quantity -= quantity;
        await ticket.save({ session });

        await session.commitTransaction();
        
        res.json({
            message: "Compra realizada com sucesso",
            purchase
        });
    } catch (error) {
        console.error("Erro na compra de ingresso:", error);
        await session.abortTransaction();
        res.status(500).json({ message: "Erro ao comprar ingresso", error: error.message || error });
    } finally {
        session.endSession();
    }
};