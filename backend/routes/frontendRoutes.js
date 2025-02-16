const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/authMiddleware');
const Ticket = require("../models/Ticket"); 
const Purchase = require("../models/Purchase");

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', {hideHeader: true});
});

router.get('/register', (req, res) => {
    res.render('register', {hideHeader: true});
});

router.get("/home", authMiddleware, checkAdmin, (req, res) => {
    res.render("home", { isAdmin: res.locals.isAdmin
     });
});

router.get('/buyTicket/:id', authMiddleware, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).lean();
        if (!ticket) {
            return res.status(404).send("Ingresso não encontrado");
        }
        res.render("buyTicket", { ticket });
    } catch (error) {
        res.status(500).send("Erro ao carregar página de compra");
    }
});

router.get('/historical', authMiddleware, async (req, res) => {
    try {
        console.log("User ID:", req.user.id);
        const purchases = await Purchase.find({ userId: req.user.id })
            .populate('items.ticketId')
            .lean();

        purchases.forEach(purchase => {
            purchase.totalAmount = purchase.items.reduce((sum, item) => {
                return sum + (item.quantity * item.priceAtPurchase);
            }, 0);
        });

        console.log({ purchases });
        res.render('historical', { purchases });
    } catch (error) {
        res.status(500).send('Erro ao carregar histórico de compras');
    }
});

router.get('/tickets', (req, res) => {
    res.render('tickets');
});

module.exports = router;