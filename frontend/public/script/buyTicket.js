document.addEventListener("DOMContentLoaded", () => {
    const ticketId = window.location.pathname.split('/').pop(); // Pega o ID da URL (último segmento)

    const ticketPrice = parseFloat(document.getElementById("ticket-price").innerText);
    const quantityInput = document.getElementById("quantity");
    const totalPriceEl = document.getElementById("total-price");
    const buyButton = document.getElementById("buy-button");

    quantityInput.addEventListener("input", () => {
        const quantity = parseInt(quantityInput.value);
        totalPriceEl.innerText = (ticketPrice * quantity).toFixed(2);
    });

    buyButton.addEventListener("click", async () => {
        const quantity = parseInt(quantityInput.value);

        const response = await fetch(`/api/tickets/buy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ quantity, ticketId })
        });
        

        const data = await response.json();
        if (response.ok) {
            alert("Compra realizada com sucesso!");
            window.location.href = "/home";
        } else {
            alert(data.message || "Erro ao comprar ingresso.");
        }
    });
});