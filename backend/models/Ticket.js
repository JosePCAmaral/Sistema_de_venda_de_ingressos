const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
});

module.exports = mongoose.model("Ticket", TicketSchema);
