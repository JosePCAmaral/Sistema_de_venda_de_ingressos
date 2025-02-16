document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/tickets/home-data");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao carregar ingressos.");
        }

        const baratosContainer = document.querySelector(".lista-baratos");
        baratosContainer.innerHTML = data.ingressosBaratos.map(ticket =>
            `<li class="item-barato">
                <strong>${ticket.name}</strong> - R$ ${ticket.price}
                <a href="/buyTicket/${ticket._id}">🔎 Ver Detalhes</a>
            </li>`
        ).join("");

        const poucaQtdContainer = document.querySelector(".lista-pouca-qtd");
        poucaQtdContainer.innerHTML = data.ingressosPoucaQtd.map(ticket =>
            `<li class="item-pouca-qtd">
                <strong>${ticket.name}</strong> - Restam apenas ${ticket.quantity} ingressos!
                <a href="/buyTicket/${ticket._id}">🔎 Comprar Agora</a>
            </li>`
        ).join("");

    } catch (error) {
        console.error("Erro ao carregar ingressos:", error);
    }
});