import { useEffect, useState } from "react";

const initialTickets = [
  {
    id: 1,
    title: "Login button not working",
    description: "Users cannot log in after entering valid credentials.",
    priority: "High",
    status: "To Do",
    assignee: "Abhitha",
  },
  {
    id: 2,
    title: "Dashboard loading slowly",
    description: "Dashboard takes more than 5 seconds to load.",
    priority: "Medium",
    status: "In Progress",
    assignee: "Rahul",
  },
  {
    id: 3,
    title: "Fix mobile layout",
    description: "Some buttons are overlapping on mobile screens.",
    priority: "Low",
    status: "Done",
    assignee: "Priya",
  },
];

function App() {
  const [tickets, setTickets] = useState(initialTickets);
  useEffect(() => {
  fetch("https://bug-tracker-doha.onrender.com/api/tickets")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }
      return response.json();
    })
    .then((data) => {
      setTickets(data);
    })
    .catch((error) => {
      console.error("Error fetching tickets:", error);
    });
}, []);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee: "Abhitha",
    status: "To Do",
  });

  const addTicket = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a ticket title");
      return;
    }

    const newTicket = {
      id: Date.now(),
      ...form,
    };

   const response = await fetch("https://bug-tracker-doha.onrender.com/api/tickets", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newTicket),
});

if (!response.ok) {
  throw new Error("Failed to create ticket");
}

const savedTicket = await response.json();

setTickets([savedTicket, ...tickets]);

    setForm({
      title: "",
      description: "",
      priority: "Medium",
      assignee: "Abhitha",
      status: "To Do",
    });

    setShowForm(false);
  };

 const deleteTicket = async (id) => {
  try {
    const response = await fetch(`https://bug-tracker-doha.onrender.com/api/tickets/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete ticket");
    }

    setTickets((currentTickets) =>
      currentTickets.filter((ticket) => ticket.id !== id)
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);
    alert("Failed to delete ticket");
  }
};
const editTicket = async (ticket) => {
  const title = prompt("Enter ticket title:", ticket.title);
  if (title === null) return;

  const description = prompt(
    "Enter ticket description:",
    ticket.description
  );
  if (description === null) return;

  const priority = prompt(
    "Enter priority (Low, Medium, High):",
    ticket.priority
  );
  if (priority === null) return;

  const assignee = prompt(
    "Enter assignee:",
    ticket.assignee
  );
  if (assignee === null) return;

  try {
    const response = await fetch(
      `https://bug-tracker-doha.onrender.com/api/tickets/${ticket.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          assignee,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to edit ticket");
    }

    const updatedTicket = await response.json();

    setTickets((currentTickets) =>
      currentTickets.map((currentTicket) =>
        currentTicket.id === ticket.id
          ? updatedTicket
          : currentTicket
      )
    );
  } catch (error) {
    console.error("Error editing ticket:", error);
    alert("Failed to edit ticket");
  }
};

  const moveTicket = async (id, newStatus) => {
  try {
    const response = await fetch(`https://bug-tracker-doha.onrender.com/api/tickets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error("Failed to update ticket");
    }

    const updatedTicket = await response.json();

    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === id ? updatedTicket : ticket
      )
    );
  } catch (error) {
    console.error("Error updating ticket:", error);
    alert("Failed to update ticket status");
  }
};

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || ticket.status === filter;

    return matchesSearch && matchesFilter;
  });

  const todo = filteredTickets.filter((t) => t.status === "To Do");
  const progress = filteredTickets.filter(
    (t) => t.status === "In Progress"
  );
  const done = filteredTickets.filter((t) => t.status === "Done");

  const total = tickets.length;
  const completed = tickets.filter((t) => t.status === "Done").length;
  const inProgress = tickets.filter(
    (t) => t.status === "In Progress"
  ).length;
  const highPriority = tickets.filter(
    (t) => t.priority === "High"
  ).length;

  const TicketCard = ({ ticket }) => (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            color: "#111827",
          }}
        >
          {ticket.title}
        </h3>
<button
  onClick={() => editTicket(ticket)}
  style={{
    border: "none",
    background: "#dbeafe",
    color: "#2563eb",
    borderRadius: "6px",
    cursor: "pointer",
    padding: "4px 8px",
    marginRight: "8px",
  }}
>
  ✏️ Edit
</button>
        <button
          onClick={() => deleteTicket(ticket.id)}
          style={{
            border: "none",
            background: "#fee2e2",
            color: "#dc2626",
            borderRadius: "6px",
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          🗑
        </button>
      </div>

      <p
        style={{
          color: "#6b7280",
          fontSize: "13px",
          lineHeight: "1.5",
        }}
      >
        {ticket.description || "No description"}
      </p>

      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            background:
              ticket.priority === "High"
                ? "#fee2e2"
                : ticket.priority === "Medium"
                ? "#fef3c7"
                : "#dcfce7",
            color:
              ticket.priority === "High"
                ? "#dc2626"
                : ticket.priority === "Medium"
                ? "#b45309"
                : "#15803d",
            padding: "4px 8px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          {ticket.priority}
        </span>

        <span
          style={{
            background: "#eef2ff",
            color: "#4f46e5",
            padding: "4px 8px",
            borderRadius: "20px",
            fontSize: "11px",
          }}
        >
          👤 {ticket.assignee}
        </span>
      </div>

      <select
        value={ticket.status}
        onChange={(e) =>
          moveTicket(ticket.id, e.target.value)
        }
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "7px",
          border: "1px solid #d1d5db",
          background: "white",
          cursor: "pointer",
        }}
      >
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
    </div>
  );

  const Column = ({ title, tickets, icon }) => (
    <div
      style={{
        background: "#f3f4f6",
        borderRadius: "14px",
        padding: "16px",
        flex: 1,
        minWidth: "280px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            margin: 0,
            color: "#374151",
          }}
        >
          {icon} {title}
        </h2>

        <span
          style={{
            background: "white",
            padding: "4px 9px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {tickets.length}
        </span>
      </div>

      {tickets.length === 0 ? (
        <p
          style={{
            color: "#9ca3af",
            textAlign: "center",
            padding: "20px",
          }}
        >
          No tickets
        </p>
      ) : (
     filteredTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))
      )}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#111827",
          color: "white",
          padding: "18px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>
            🐛 BugTracker
          </h1>
          <p
            style={{
              margin: "5px 0 0",
              color: "#9ca3af",
              fontSize: "13px",
            }}
          >
            Team Issue Management System
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            background: "#6366f1",
            color: "white",
            border: "none",
            padding: "11px 18px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          + Create Ticket
        </button>
      </header>

      {/* MAIN */}
      <main
        style={{
          maxWidth: "1400px",
          margin: "auto",
          padding: "25px",
        }}
      >
        {/* PROJECT BAR */}
        <div
          style={{
            background: "white",
            padding: "18px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div>
            <strong>Project:</strong> Bug Tracker
          </div>

          <div style={{ color: "#6b7280", fontSize: "13px" }}>
            👥 4 Team Members
          </div>
        </div>

        {/* STATISTICS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <Stat title="Total Tickets" value={total} icon="🎫" />
          <Stat
            title="In Progress"
            value={inProgress}
            icon="⚙️"
          />
          <Stat
            title="Completed"
            value={completed}
            icon="✅"
          />
          <Stat
            title="High Priority"
            value={highPriority}
            icon="🔥"
          />
        </div>

        {/* SEARCH + FILTER */}
        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            border: "1px solid #e5e7eb",
          }}
        >
          <input
            placeholder="🔍 Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: "220px",
              padding: "11px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
            }}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "11px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
            }}
          >
            <option>All</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>

        {/* KANBAN BOARD */}
        <div
          style={{
           display: "flex",
gap: "18px",
flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <Column
            title="To Do"
            icon="📋"
            tickets={todo}
          />

          <Column
            title="In Progress"
            icon="🔄"
            tickets={progress}
          />

          <Column
            title="Done"
            icon="✅"
            tickets={done}
          />
        </div>
      </main>

      {/* CREATE TICKET MODAL */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={addTicket}
            style={{
              background: "white",
              width: "100%",
              maxWidth: "500px",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0 }}>
                Create New Ticket
              </h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <label>Ticket Title</label>

            <input
              required
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              placeholder="Example: Login page error"
              style={inputStyle}
            />

            <label>Description</label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder="Describe the issue..."
              rows="4"
              style={inputStyle}
            />

            <label>Priority</label>

            <select
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <label>Assign To</label>

            <select
              value={form.assignee}
              onChange={(e) =>
                setForm({
                  ...form,
                  assignee: e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>Abhitha</option>
              <option>Rahul</option>
              <option>Priya</option>
              <option>Arjun</option>
            </select>

            <label>Status</label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <button
              type="submit"
              style={{
                width: "100%",
                background: "#6366f1",
                color: "white",
                border: "none",
                padding: "13px",
                borderRadius: "8px",
                fontWeight: "bold",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Create Ticket
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginTop: "5px",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: "13px",
        }}
      >
        {title}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px",
  marginTop: "6px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};

export default App;