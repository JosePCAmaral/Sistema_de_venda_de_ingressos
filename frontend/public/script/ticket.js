async function fetchTickets() {
    try {
        const response = await fetch('/api/tickets/getTickets');
        const data = await response.json();

        const ingressosContainer = document.querySelector(".ticket-list");
        ingressosContainer.innerHTML = data.map(ticket =>
            `<li class="ticket-item">
                <strong>${ticket.name}</strong> - R$ ${ticket.price}
                <a href="/buyTicket/${ticket._id}">🔎 Comprar Agora</a>
            </li>`
        ).join("");
    } catch (error) {
        console.error("Erro ao carregar ingressos:", error);
    }
}

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    const allTickets = document.querySelectorAll('.ticket-item');
    allTickets.forEach(ticketElement => {
        const ticketName = ticketElement.querySelector('strong').textContent.toLowerCase();
        ticketElement.style.display = ticketName.includes(searchQuery) ? 'block' : 'none';
    });
});

fetchTickets();
