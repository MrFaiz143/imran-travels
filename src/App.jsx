import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DESTINATIONS = [
  "Surat", "Nashik", "Aurangabad", "Gevrai", "Beed", "Jalna", "Latur",
  "Solapur", "Parbhani", "Nanded", "Mumbai", "Pune", "Ahmednagar",
  "Bhiwandi", "Nagpur", "Ahmedabad", "Amravati", "Akola", "Chikli",
  "Buldhana", "Washim", "Mehkar", "Jalgaon", "Bhusawal", "Jaipur",
  "Ajmer", "Bangalore", "Hyderabad"
];

const PAYMENT_MODES = ["Cash", "Online"];

// Generate 40 seats: Left side Wide (L1A,L1B,L1C upper/lower), Right side Single (R1 upper/lower)
// 8 rows, Left: 3 seats per berth x 2 (up/low) = 6 per row, Right: 1 x 2 = 2 per row
// Total per row = 8, x 5 rows = 40 (we use 5 rows to get 40)
// Actually: 40 seats / 8 per row = 5 rows displayed but friend said 8 rows
// Let's do: Left lower 3 + Left upper 3 + Right lower 1 + Right upper 1 = 8 per row x 5 rows = 40

function generateSeats() {
  const seats = [];
  const rows = 5; // 5 rows x 8 seats = 40
  for (let r = 1; r <= rows; r++) {
    // Left Lower (3 seats)
    seats.push({ id: `L${r}A-Lo`, row: r, side: "left", level: "lower", pos: "A", label: `L${r}A\nLower` });
    seats.push({ id: `L${r}B-Lo`, row: r, side: "left", level: "lower", pos: "B", label: `L${r}B\nLower` });
    seats.push({ id: `L${r}C-Lo`, row: r, side: "left", level: "lower", pos: "C", label: `L${r}C\nLower` });
    // Left Upper (3 seats)
    seats.push({ id: `L${r}A-Up`, row: r, side: "left", level: "upper", pos: "A", label: `L${r}A\nUpper` });
    seats.push({ id: `L${r}B-Up`, row: r, side: "left", level: "upper", pos: "B", label: `L${r}B\nUpper` });
    seats.push({ id: `L${r}C-Up`, row: r, side: "left", level: "upper", pos: "C", label: `L${r}C\nUpper` });
    // Right Lower (1 seat)
    seats.push({ id: `R${r}-Lo`, row: r, side: "right", level: "lower", pos: "A", label: `R${r}\nLower` });
    // Right Upper (1 seat)
    seats.push({ id: `R${r}-Up`, row: r, side: "right", level: "upper", pos: "A", label: `R${r}\nUpper` });
  }
  return seats;
}

const ALL_SEATS = generateSeats();

// Format date: 2026-06-25 → 25/06/2026
function formatDate(dateStr) {
  if (!dateStr) return "--";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

// Format seat name: L1A-Lo → L1A Lower, R1-Up → R1 Upper
function formatSeat(seatId) {
  return seatId.replace("-Lo", " Lower").replace("-Up", " Upper");
}

function formatSeats(seats) {
  return seats?.map(formatSeat).join(", ") || "--";
}

function generateTicketNo(busNo) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(2);
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `IM${busNo}${dd}${mm}${yy}${rand}`;
}

function QRPlaceholder({ value }) {
  return (
    <div style={{
      width: 75, height: 75, border: "2px solid #1a237e",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", background: "#fff", padding: 4
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1, marginBottom: 2 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8,
            background: [0,1,2,5,6,7,10,12,14,17,18,19,20,22,24].includes(i) ? "#1a237e" : "#fff",
            border: "0.5px solid #ccc"
          }} />
        ))}
      </div>
      <span style={{ fontSize: 6, color: "#1a237e", wordBreak: "break-all", textAlign: "center" }}>{value?.slice(-8)}</span>
    </div>
  );
}

function TicketPrint({ booking }) {
  return (
    <div id="ticket-print" style={{
      fontFamily: "Arial, sans-serif", width: 760, background: "#fff",
      display: "flex", border: "2px solid #e0e0e0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.12)"
    }}>
      {/* LEFT */}
      <div style={{ flex: 1.4, padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 70,
          background: "linear-gradient(135deg, #1a237e 60%, #c9a84c 100%)",
          clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 100%)"
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#1a237e", letterSpacing: 1 }}>IMRAN TRAVELS</div>
            <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, fontWeight: 600 }}>BUS TICKET / BOARDING PASS</div>
          </div>
          <div style={{ fontSize: 48 }}>🚌</div>
        </div>
        <hr style={{ border: "none", borderTop: "2px solid #e0e0e0", margin: "12px 0" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 0, marginBottom: 0 }}>
          {[
            { label: "1. PASSENGER NAME", value: booking.passengerName },
            { label: "2. BUS NO", value: booking.busNo },
            { label: "3. TOTAL SEATS", value: booking.selectedSeats?.length },
            { label: "4. SEAT NO", value: formatSeats(booking.selectedSeats) },
          ].map((f, i) => (
            <div key={i} style={{ borderRight: i < 3 ? "1px solid #e0e0e0" : "none", borderBottom: "1px solid #e0e0e0", padding: "8px 10px" }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e", marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{f.value || "--"}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, marginBottom: 16 }}>
          {[
            { label: "5. JOURNEY DATE", value: formatDate(booking.journeyDate) },
            { label: "6. JOURNEY", value: booking.to },
            { label: "7. AMOUNT", value: `₹${booking.amount}` },
          ].map((f, i) => (
            <div key={i} style={{ borderRight: i < 2 ? "1px solid #e0e0e0" : "none", borderBottom: "1px solid #e0e0e0", padding: "8px 10px" }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e", marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{f.value || "--"}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 50 }}>
          <div>
            <div style={{ fontSize: 8, color: "#1a237e", fontWeight: 700 }}>📍 FROM</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{booking.from || "--"}</div>
            <div style={{ fontSize: 8, color: "#1a237e", fontWeight: 700, marginTop: 6 }}>📍 TO</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{booking.to || "--"}</div>
          </div>
          <div>
            <div style={{ fontSize: 8, color: "#1a237e", fontWeight: 700 }}>📅 DATE</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{formatDate(booking.journeyDate)}</div>
            <div style={{ fontSize: 8, color: "#1a237e", fontWeight: 700, marginTop: 6 }}>🕐 TIME</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{booking.time || "--"}</div>
          </div>
          <div>
            <div style={{ fontSize: 8, color: "#1a237e", fontWeight: 700 }}>👤 BOOKING BY</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Imran Travels</div>
            <div style={{ fontSize: 8, color: "#1a237e", fontWeight: 700, marginTop: 6 }}>💳 PAYMENT MODE</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{booking.paymentMode || "--"}</div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
          THANK YOU FOR TRAVELING WITH US!
        </div>
      </div>
      {/* DIVIDER */}
      <div style={{ width: 2, background: "repeating-linear-gradient(to bottom, #ccc 0px, #ccc 8px, transparent 8px, transparent 14px)" }} />
      {/* RIGHT */}
      <div style={{ width: 220, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <span style={{ color: "#c9a84c" }}>★</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: "#1a237e", margin: "0 6px" }}>IMRAN TRAVELS</span>
          <span style={{ color: "#c9a84c" }}>★</span>
        </div>
        <div style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: 8 }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>PASSENGER NAME</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{booking.passengerName || "--"}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, borderBottom: "1px solid #e0e0e0", paddingBottom: 8 }}>
          <div><div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>BUS NO</div><div style={{ fontSize: 13, fontWeight: 600 }}>{booking.busNo || "--"}</div></div>
          <div><div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>SEAT NO</div><div style={{ fontSize: 11, fontWeight: 600 }}>{formatSeats(booking.selectedSeats)}</div></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, borderBottom: "1px solid #e0e0e0", paddingBottom: 8 }}>
          <div><div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>JOURNEY DATE</div><div style={{ fontSize: 12, fontWeight: 600 }}>{formatDate(booking.journeyDate)}</div></div>
          <div><div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>JOURNEY</div><div style={{ fontSize: 13, fontWeight: 600 }}>{booking.to || "--"}</div></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, borderBottom: "1px solid #e0e0e0", paddingBottom: 8 }}>
          <div><div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>TOTAL SEATS</div><div style={{ fontSize: 13, fontWeight: 600 }}>{booking.selectedSeats?.length || "--"}</div></div>
          <div><div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>AMOUNT</div><div style={{ fontSize: 13, fontWeight: 600 }}>₹{booking.amount || "--"}</div></div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
          <QRPlaceholder value={booking.ticketNo} />
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>TICKET NO</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#222", wordBreak: "break-all" }}>{booking.ticketNo}</div>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 9, color: "#888", marginTop: "auto" }}>HAVE A SAFE JOURNEY!</div>
      </div>
    </div>
  );
}

const emptyForm = {
  passengerName: "", busNo: "", journeyDate: "",
  from: "", to: "", time: "", amount: "", paymentMode: "Cash"
};

function SeatMap({ bookedSeats, selectedSeats, onToggle }) {
  const rows = 5;
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 20, userSelect: "none" }}>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, justifyContent: "center" }}>
        {[
          { color: "#4caf50", label: "Available" },
          { color: "#f44336", label: "Booked" },
          { color: "#ffc107", label: "Selected" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 16, height: 16, background: l.color, borderRadius: 3 }} />
            <span style={{ color: "#fff", fontSize: 11 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Driver */}
      <div style={{ textAlign: "center", color: "#c9a84c", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
        🚌 DRIVER — FRONT
      </div>

      {/* Bus body */}
      <div style={{ background: "#16213e", borderRadius: 8, padding: "12px 8px", border: "2px solid #c9a84c" }}>
        {/* Labels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: 8, marginBottom: 8 }}>
          <div style={{ textAlign: "center", color: "#c9a84c", fontSize: 11, fontWeight: 700 }}>LEFT (Wide Berth)</div>
          <div />
          <div style={{ textAlign: "center", color: "#c9a84c", fontSize: 11, fontWeight: 700 }}>RIGHT (Single)</div>
        </div>

        {Array.from({ length: rows }).map((_, rowIdx) => {
          const r = rowIdx + 1;
          const leftLower = [`L${r}A-Lo`, `L${r}B-Lo`, `L${r}C-Lo`];
          const leftUpper = [`L${r}A-Up`, `L${r}B-Up`, `L${r}C-Up`];
          const rightLower = `R${r}-Lo`;
          const rightUpper = `R${r}-Up`;

          const SeatBtn = ({ seatId, small }) => {
            const isBooked = bookedSeats.includes(seatId);
            const isSelected = selectedSeats.includes(seatId);
            const bg = isBooked ? "#f44336" : isSelected ? "#ffc107" : "#4caf50";
            const textColor = isSelected ? "#000" : "#fff";
            return (
              <div
                onClick={() => !isBooked && onToggle(seatId)}
                style={{
                  background: bg, color: textColor,
                  borderRadius: 4, padding: small ? "4px 3px" : "5px 4px",
                  fontSize: 8, fontWeight: 700, textAlign: "center",
                  cursor: isBooked ? "not-allowed" : "pointer",
                  minWidth: small ? 28 : 32,
                  lineHeight: 1.3,
                  transition: "transform 0.1s",
                  boxShadow: isSelected ? "0 0 6px #ffc107" : "none"
                }}
                title={seatId}
              >
                {seatId.replace("-Lo", "\nL").replace("-Up", "\nU")}
              </div>
            );
          };

          return (
            <div key={r} style={{ marginBottom: 10 }}>
              {/* Row label */}
              <div style={{ color: "#667", fontSize: 9, textAlign: "center", marginBottom: 4 }}>— Row {r} —</div>
              
              {/* Lower berths */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: 8, marginBottom: 4 }}>
                {/* Left lower */}
                <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                  {leftLower.map(s => <SeatBtn key={s} seatId={s} />)}
                </div>
                {/* Aisle */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 2, height: "100%", background: "#333", minHeight: 28 }} />
                </div>
                {/* Right lower */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <SeatBtn seatId={rightLower} />
                </div>
              </div>

              {/* Upper berths */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: 8 }}>
                <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                  {leftUpper.map(s => <SeatBtn key={s} seatId={s} />)}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 2, height: "100%", background: "#333", minHeight: 28 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <SeatBtn seatId={rightUpper} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", color: "#667", fontSize: 10, marginTop: 10 }}>
        Total Seats: 40 | Available: {40 - bookedSeats.length - selectedSeats.length} | Selected: {selectedSeats.length}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("form");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("imran_bookings_v2") || "[]"); } catch { return []; }
  });
  const [currentTicket, setCurrentTicket] = useState(null);
  const [search, setSearch] = useState("");

  // All booked seat ids across all bookings
  const allBookedSeats = bookings.flatMap(b => b.selectedSeats || []);

  const toggleSeat = (seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const validate = () => {
    const e = {};
    if (!form.passengerName.trim()) e.passengerName = "Required";
    if (!form.busNo.trim()) e.busNo = "Required";
    if (!form.journeyDate) e.journeyDate = "Required";
    if (!form.from) e.from = "Required";
    if (!form.to) e.to = "Required";
    if (!form.time.trim()) e.time = "Required";
    if (!form.amount) e.amount = "Required";
    if (selectedSeats.length === 0) e.seats = "Please select at least one seat";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const ticket = {
      ...form,
      selectedSeats,
      ticketNo: generateTicketNo(form.busNo),
      bookedAt: new Date().toISOString()
    };
    const updated = [ticket, ...bookings];
    setBookings(updated);
    localStorage.setItem("imran_bookings_v2", JSON.stringify(updated));
    setCurrentTicket(ticket);
    setSelectedSeats([]);
    setView("ticket");
    setForm(emptyForm);
    setErrors({});
  };

  const handlePrint = async () => {
    const element = document.getElementById("ticket-print");
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`Ticket-${currentTicket.ticketNo}.pdf`);
  };

  const inp = (field, label, type = "text", placeholder = "") => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#1a237e" }}>{label}</label>
      <input
        type={type}
        value={form[field]}
        placeholder={placeholder}
        onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: "" })); }}
        style={{
          padding: "9px 12px", borderRadius: 6, fontSize: 13,
          border: errors[field] ? "1.5px solid #e53935" : "1.5px solid #c5cae9",
          outline: "none", background: "#f8f9ff"
        }}
      />
      {errors[field] && <span style={{ fontSize: 10, color: "#e53935" }}>{errors[field]}</span>}
    </div>
  );

  const sel = (field, label, options) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#1a237e" }}>{label}</label>
      <select
        value={form[field]}
        onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: "" })); }}
        style={{
          padding: "9px 12px", borderRadius: 6, fontSize: 13,
          border: errors[field] ? "1.5px solid #e53935" : "1.5px solid #c5cae9",
          outline: "none", background: "#f8f9ff",
          color: form[field] ? "#222" : "#999"
        }}
      >
        <option value="">-- Select --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[field] && <span style={{ fontSize: 10, color: "#e53935" }}>{errors[field]}</span>}
    </div>
  );

  const filtered = bookings.filter(b =>
    b.passengerName?.toLowerCase().includes(search.toLowerCase()) ||
    b.ticketNo?.toLowerCase().includes(search.toLowerCase()) ||
    b.from?.toLowerCase().includes(search.toLowerCase()) ||
    b.to?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#eef0fb", fontFamily: "Arial, sans-serif" }}>
      {/* TOPBAR */}
      <div style={{ background: "#1a237e", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <span style={{ color: "#c9a84c", fontSize: 16 }}>★</span>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: "0 8px" }}>IMRAN TRAVELS</span>
          <span style={{ color: "#c9a84c", fontSize: 16 }}>★</span>
          <div style={{ color: "#c5cae9", fontSize: 10, letterSpacing: 2, marginTop: 2 }}>BOOKING MANAGEMENT SYSTEM</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { key: "form", label: "📝 NEW BOOKING" },
            { key: "records", label: "📋 RECORDS" }
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key)} style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: "2px solid #c9a84c",
              background: view === v.key ? "#c9a84c" : "transparent",
              color: view === v.key ? "#1a237e" : "#c9a84c",
            }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>

        {/* BOOKING FORM */}
        {view === "form" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Form fields */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 16px rgba(26,35,126,0.08)" }}>
              <h2 style={{ color: "#1a237e", margin: "0 0 20px", fontSize: 17, fontWeight: 800, borderBottom: "2px solid #e8eaf6", paddingBottom: 10 }}>
                🎫 Passenger & Journey Details
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {inp("passengerName", "PASSENGER NAME", "text", "Full name")}
                {inp("busNo", "BUS NO", "text", "e.g. 7035")}
                {sel("from", "FROM", DESTINATIONS)}
                {sel("to", "TO", DESTINATIONS)}
                {inp("journeyDate", "JOURNEY DATE", "date")}
                {inp("time", "DEPARTURE TIME", "text", "e.g. 08:30 PM")}
                {inp("amount", "AMOUNT (₹)", "number", "e.g. 800")}
                {sel("paymentMode", "PAYMENT MODE", PAYMENT_MODES)}
              </div>
            </div>

            {/* Seat Map */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 16px rgba(26,35,126,0.08)" }}>
              <h2 style={{ color: "#1a237e", margin: "0 0 16px", fontSize: 17, fontWeight: 800, borderBottom: "2px solid #e8eaf6", paddingBottom: 10 }}>
                🪑 Select Seats
              </h2>
              {errors.seats && <div style={{ color: "#e53935", fontSize: 12, marginBottom: 10 }}>⚠️ {errors.seats}</div>}
              {selectedSeats.length > 0 && (
                <div style={{ background: "#e8eaf6", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>
                  ✅ Selected: <strong>{selectedSeats.join(", ")}</strong> ({selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""})
                </div>
              )}
              <SeatMap
                bookedSeats={allBookedSeats}
                selectedSeats={selectedSeats}
                onToggle={toggleSeat}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleSubmit} style={{
                padding: "12px 36px", background: "#1a237e", color: "#fff",
                borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
                boxShadow: "0 3px 10px rgba(26,35,126,0.3)", letterSpacing: 1
              }}>
                🎟️ GENERATE TICKET
              </button>
            </div>
          </div>
        )}

        {/* TICKET */}
        {view === "ticket" && currentTicket && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ color: "#1a237e", margin: 0, fontWeight: 800 }}>✅ Ticket Generated!</h2>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setView("form")} style={{
                  padding: "9px 20px", background: "#e8eaf6", color: "#1a237e",
                  borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer"
                }}>+ New Booking</button>
                <button onClick={handlePrint} style={{
                  padding: "9px 20px", background: "#1a237e", color: "#fff",
                  borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer"
                }}>🖨️ Print / Download PDF</button>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <TicketPrint booking={currentTicket} />
            </div>
          </div>
        )}

        {/* RECORDS */}
        {view === "records" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 16px rgba(26,35,126,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ color: "#1a237e", margin: 0, fontSize: 17, fontWeight: 800 }}>📋 Booking Records ({bookings.length})</h2>
              <input
                placeholder="🔍 Search name, ticket, route..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: "8px 14px", borderRadius: 20, border: "1.5px solid #c5cae9", fontSize: 13, width: 240, outline: "none" }}
              />
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", color: "#9fa8da", padding: 40, fontSize: 15 }}>No bookings found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#e8eaf6" }}>
                      {["Ticket No", "Passenger", "From", "To", "Date", "Bus No", "Seats", "Seat IDs", "Amount", "Payment", "Action"].map(h => (
                        <th key={h} style={{ padding: "10px 8px", textAlign: "left", color: "#1a237e", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #e8eaf6", background: i % 2 === 0 ? "#fff" : "#f8f9ff" }}>
                        <td style={{ padding: "8px", fontWeight: 700, color: "#3949ab", fontSize: 10 }}>{b.ticketNo}</td>
                        <td style={{ padding: "8px" }}>{b.passengerName}</td>
                        <td style={{ padding: "8px" }}>{b.from}</td>
                        <td style={{ padding: "8px" }}>{b.to}</td>
                        <td style={{ padding: "8px" }}>{formatDate(b.journeyDate)}</td>
                        <td style={{ padding: "8px" }}>{b.busNo}</td>
                        <td style={{ padding: "8px", textAlign: "center" }}>{b.selectedSeats?.length}</td>
                        <td style={{ padding: "8px", fontSize: 10 }}>{formatSeats(b.selectedSeats)}</td>
                        <td style={{ padding: "8px", fontWeight: 700 }}>₹{b.amount}</td>
                        <td style={{ padding: "8px" }}>{b.paymentMode}</td>
                        <td style={{ padding: "8px" }}>
                          <button onClick={() => { setCurrentTicket(b); setView("ticket"); }} style={{
                            padding: "5px 10px", background: "#1a237e", color: "#fff",
                            border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700
                          }}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
