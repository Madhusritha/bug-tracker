const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let tickets = JSON.parse(fs.readFileSync("./tickets.json", "utf-8"));

const saveTickets = () => {
  fs.writeFileSync(
    "./tickets.json",
    JSON.stringify(tickets, null, 2)
  );
};

app.get("/", (req, res) => {
  res.json({
    message: "Bug Tracker backend is running!"
  });
});

app.get("/api/tickets", (req, res) => {
  res.json(tickets);
});

app.post("/api/tickets", (req, res) => {
  const newTicket = {
    id: Date.now(),
    ...req.body
  };

  tickets.push(newTicket);
  saveTickets();

  res.status(201).json(newTicket);
});

app.put("/api/tickets/:id", (req, res) => {
  const id = Number(req.params.id);

  const ticketIndex = tickets.findIndex(
    (ticket) => ticket.id === id
  );

  if (ticketIndex === -1) {
    return res.status(404).json({
      message: "Ticket not found"
    });
  }

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    ...req.body
  };

  saveTickets();

  res.json(tickets[ticketIndex]);
});

app.delete("/api/tickets/:id", (req, res) => {
  const id = Number(req.params.id);

  const ticketIndex = tickets.findIndex(
    (ticket) => ticket.id === id
  );

  if (ticketIndex === -1) {
    return res.status(404).json({
      message: "Ticket not found"
    });
  }

  tickets.splice(ticketIndex, 1);
  saveTickets();

  res.json({
    message: "Ticket deleted successfully"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});