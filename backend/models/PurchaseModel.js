const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Relacionamento com User
    purchaseId: { type: String, unique: true, required: true }, // ID único da compra
    purchaseDate: { type: Date, default: Date.now }, // Data e horário gerados automaticamente
    items: [
        {
            ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true }, // ID do ingresso comprado
            quantity: { type: Number, required: true, min: 1 }, // Quantidade de ingressos
        }
    ],
    totalPrice: { type: Number, required: true } // Valor total da compra
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
