const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    purchaseId: { type: String, unique: true, required: true },
    purchaseDate: { type: Date, default: Date.now },
    items: [
        {
            ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
            quantity: { type: Number, required: true, min: 1 },
        }
    ],
    totalPrice: { type: Number, required: true }
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
