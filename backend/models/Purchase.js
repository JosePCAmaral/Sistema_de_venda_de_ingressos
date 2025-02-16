const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    purchaseId: { type: Number, unique: true },
    purchaseDate: { type: Date, default: Date.now },
    items: [
        {
            ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
            quantity: { type: Number, required: true, min: 1 },
            priceAtPurchase: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true }
});

PurchaseSchema.pre('save', function(next) {
    if (!this.purchaseId) {
        this.purchaseId = Math.floor(Math.random() * 1000000);
    }
    next();
});

module.exports = mongoose.model("Purchase", PurchaseSchema);