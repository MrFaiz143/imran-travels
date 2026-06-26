import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DESTINATIONS = [
  "Surat", "Nashik", "Aurangabad", "Gevrai", "Beed", "Jalna", "Latur",
  "Solapur", "Parbhani", "Nanded", "Mumbai", "Pune", "Ahmednagar",
  "Bhiwandi", "Nagpur", "Ahmedabad", "Amravati", "Akola", "Chikli",
  "Buldhana", "Washim", "Mehkar", "Jalgaon", "Bhusawal", "Jaipur",
  "Ajmer", "Bangalore", "Hyderabad", "Malegaon", "Kej", "Ambajogai"
];

const PAYMENT_MODES = ["Cash Lena He", "Online"];

const PICKUP_POINTS = [
  "Sardar Market Parsi Panchayat Parking",
  "Kadodra Nilam Hotel",
  "Palsana Sabar Hotel",
  "Navsari",
  "Chikhli"
];

const ROUTES = [
  "Surat to Aurangabad - Gevrai - Beed",
  "Surat to Malegaon - Aurangabad - Beed - Kej - Ambajogai - Latur",
  "Surat to Jalna",
  "Surat to Chikli - Buldhana - Mehkar - Washim",
  "Surat to Mumbai - Pune"
];

const SHIHORI_ROWS = [
  { leftUpper: "B",  leftLower: "A",  rightLower: "3-4",   rightUpper: "1-2"   },
  { leftUpper: "C",  leftLower: "D",  rightLower: "5-6",   rightUpper: "7-8"   },
  { leftUpper: "F",  leftLower: "E",  rightLower: "11-12", rightUpper: "9-10"  },
  { leftUpper: "G",  leftLower: "H",  rightLower: "13-14", rightUpper: "15-16" },
  { leftUpper: "J",  leftLower: "I",  rightLower: "19-20", rightUpper: "17-18" },
  { leftUpper: "K",  leftLower: "L",  rightLower: "21-22", rightUpper: "23-24" },
];

function formatDate(dateStr) {
  if (!dateStr) return "--";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatSeats(seats) {
  return seats?.join(", ") || "--";
}

function TicketPrint({ booking }) {
  return (
    <div id="ticket-print" style={{
      fontFamily: "Arial, sans-serif", width: 780, background: "#fff",
      display: "flex", border: "2px solid #e0e0e0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.12)"
    }}>
      {/* LEFT SIDE */}
      <div style={{ flex: 1.6, padding: "20px 24px", position: "relative", overflow: "hidden" }}>
        {/* Blue diagonal bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 55,
          background: "linear-gradient(135deg, #1a237e 60%, #c9a84c 100%)",
          clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 100%)"
        }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#1a237e", letterSpacing: 1 }}>IMRAN TRAVELS</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 8, color: "#1a237e", fontWeight: 700 }}>📞 CONTACT</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#333" }}>7984061265 | 9824720467 | 9824151616</div>
          </div>
        </div>
        <hr style={{ border: "none", borderTop: "2px solid #e0e0e0", margin: "6px 0 10px" }} />

        {/* Row 1: Passenger, Bus No, Ticket No, Seat No */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1.2fr", marginBottom: 0 }}>
          {[
            { label: "1. PASSENGER NAME", value: booking.passengerName },
            { label: "2. BUS NO", value: booking.busNo },
            { label: "3. TICKET NO", value: booking.ticketNo },
            { label: "4. SEAT NO", value: formatSeats(booking.selectedSeats) },
          ].map((f, i) => (
            <div key={i} style={{
              borderRight: i < 3 ? "1px solid #e0e0e0" : "none",
              borderBottom: "1px solid #e0e0e0", padding: "7px 8px"
            }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: "#1a237e", marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#222" }}>{f.value || "--"}</div>
            </div>
          ))}
        </div>

        {/* Row 2: Source to Destination + Date */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", marginBottom: 0 }}>
          <div style={{ borderRight: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0", padding: "7px 8px" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: "#1a237e", marginBottom: 3 }}>5. SOURCE TO DESTINATION</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a237e" }}>
              {booking.from || "--"} → {booking.to || "--"}
            </div>
          </div>
          <div style={{ borderBottom: "1px solid #e0e0e0", padding: "7px 8px" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: "#1a237e", marginBottom: 3 }}>6. DATE</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{formatDate(booking.journeyDate)}</div>
          </div>
        </div>

        {/* Row 3: Pickup Point + Time + Payment */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.8fr 0.8fr", marginBottom: 14 }}>
          <div style={{ borderRight: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0", padding: "7px 8px" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: "#1a237e", marginBottom: 3 }}>7. PICKUP POINT</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#222" }}>{booking.pickupPoint || "--"}</div>
          </div>
          <div style={{ borderRight: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0", padding: "7px 8px" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: "#1a237e", marginBottom: 3 }}>⏰ TIME</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#222" }}>{booking.time || "--"}</div>
          </div>
          <div style={{ borderBottom: "1px solid #e0e0e0", padding: "7px 8px" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: "#1a237e", marginBottom: 3 }}>8. PAYMENT</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#222" }}>{booking.paymentMode || "--"}</div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>
          THANKS FOR CALL IMRAN TRAVELS
        </div>
      </div>

      {/* DIVIDER */}
      <div style={{ width: 2, background: "repeating-linear-gradient(to bottom, #ccc 0px, #ccc 8px, transparent 8px, transparent 14px)" }} />

      {/* RIGHT SIDE */}
      <div style={{ width: 200, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <span style={{ color: "#c9a84c", fontSize: 14 }}>★</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#1a237e", margin: "0 5px" }}>IMRAN TRAVELS</span>
          <span style={{ color: "#c9a84c", fontSize: 14 }}>★</span>
        </div>

        {/* Passenger Name */}
        <div style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: 8, textAlign: "center" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: "#1a237e", marginBottom: 4 }}>PASSENGER NAME</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1a237e" }}>{booking.passengerName || "--"}</div>
        </div>

        {/* Date */}
        <div style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: 8, textAlign: "center" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: "#1a237e", marginBottom: 4 }}>JOURNEY DATE</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#222" }}>{formatDate(booking.journeyDate)}</div>
        </div>

        {/* Amount */}
        <div style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: 8, textAlign: "center" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: "#1a237e", marginBottom: 4 }}>AMOUNT</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1a237e" }}>₹{booking.amount || "--"}</div>
        </div>

        {/* Routes */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: "#1a237e", marginBottom: 6 }}>🚌 OUR ROUTES</div>
          <div style={{ fontSize: 9, color: "#333", padding: "3px 0", borderBottom: "1px dashed #e0e0e0" }}>1. Surat to Aurangabad - Gevrai - Beed</div>
          <div style={{ fontSize: 9, color: "#333", padding: "3px 0", borderBottom: "1px dashed #e0e0e0" }}>2. Surat to Malegaon - Aurangabad - Beed - Kej - Ambajogai - Latur</div>
          <div style={{ fontSize: 9, color: "#333", padding: "3px 0", borderBottom: "1px dashed #e0e0e0" }}>3. Surat to Jalna</div>
          <div style={{ fontSize: 9, color: "#333", padding: "3px 0", borderBottom: "1px dashed #e0e0e0" }}>4. Surat to Chikli - Buldhana - Mehkar - Washim</div>
          <div style={{ fontSize: 9, color: "#333", padding: "3px 0" }}>5. Surat to Mumbai - Pune</div>
        </div>

        <div style={{ textAlign: "center", fontSize: 8, color: "#888" }}>HAVE A SAFE JOURNEY!</div>
      </div>
    </div>
  );
}

const emptyForm = {
  passengerName: "", ticketNo: "", busNo: "", journeyDate: "",
  from: "", to: "", pickupPoint: "", time: "", amount: "", paymentMode: "Cash Lena He"
};

function SeatMap({ bookedSeats, selectedSeats, onToggle }) {
  const totalSeats = 24;
  const available = totalSeats - bookedSeats.length - selectedSeats.length;

  const SeatBtn = ({ seatId, isUpper }) => {
    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);
    const bg = isBooked ? "#f44336" : isSelected ? "#ffc107" : isUpper ? "#2196f3" : "#4caf50";
    const textColor = isSelected ? "#000" : "#fff";
    return (
      <div
        onClick={() => !isBooked && onToggle(seatId)}
        style={{
          background: bg, color: textColor,
          borderRadius: 6, padding: "10px 6px",
          fontSize: 12, fontWeight: 700, textAlign: "center",
          cursor: isBooked ? "not-allowed" : "pointer",
          minWidth: 52, minHeight: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isSelected ? "0 0 8px #ffc107" : "0 2px 4px rgba(0,0,0,0.3)",
          opacity: isBooked ? 0.6 : 1
        }}
      >
        {seatId}
      </div>
    );
  };

  return (
    <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 20, userSelect: "none" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { color: "#2196f3", label: "Upper" },
          { color: "#4caf50", label: "Lower" },
          { color: "#f44336", label: "Booked" },
          { color: "#ffc107", label: "Selected" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 14, height: 14, background: l.color, borderRadius: 3 }} />
            <span style={{ color: "#fff", fontSize: 10 }}>{l.label}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", color: "#c9a84c", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
        🚌 DRIVER — FRONT
      </div>
      <div style={{ background: "#16213e", borderRadius: 8, padding: "16px 12px", border: "2px solid #c9a84c" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 30px 1fr 1fr", gap: 6, marginBottom: 10 }}>
          <div style={{ textAlign: "center", color: "#2196f3", fontSize: 10, fontWeight: 700 }}>UPPER</div>
          <div style={{ textAlign: "center", color: "#4caf50", fontSize: 10, fontWeight: 700 }}>LOWER</div>
          <div />
          <div style={{ textAlign: "center", color: "#4caf50", fontSize: 10, fontWeight: 700 }}>LOWER</div>
          <div style={{ textAlign: "center", color: "#2196f3", fontSize: 10, fontWeight: 700 }}>UPPER</div>
        </div>
        {SHIHORI_ROWS.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 30px 1fr 1fr", gap: 6, marginBottom: 8 }}>
            <SeatBtn seatId={row.leftUpper} isUpper={true} />
            <SeatBtn seatId={row.leftLower} isUpper={false} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 2, height: "100%", background: "#333", minHeight: 40 }} />
            </div>
            <SeatBtn seatId={row.rightLower} isUpper={false} />
            <SeatBtn seatId={row.rightUpper} isUpper={true} />
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", color: "#9fa8da", fontSize: 11, marginTop: 12 }}>
        Total: {totalSeats} | Available: {available} | Selected: {selectedSeats.length}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("form");
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("imran_bookings_v4") || "[]"); } catch { return []; }
  });
  const [currentTicket, setCurrentTicket] = useState(null);
  const [search, setSearch] = useState("");

  const allBookedSeats = bookings.flatMap(b => b.selectedSeats || []);

  const toggleSeat = (seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const validate = () => {
    const e = {};
    if (!form.passengerName.trim()) e.passengerName = "Required";
    if (!form.ticketNo.trim()) e.ticketNo = "Required";
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
    const ticket = { ...form, selectedSeats, bookedAt: new Date().toISOString() };
    const updated = [ticket, ...bookings];
    setBookings(updated);
    localStorage.setItem("imran_bookings_v4", JSON.stringify(updated));
    setCurrentTicket(ticket);
    setSelectedSeats([]);
    setView("ticket");
    setForm({ ...emptyForm });
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
          outline: "none", background: "#f8f9ff", color: "#222", width: "100%", boxSizing: "border-box"
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
          outline: "none", background: "#f8f9ff", color: "#222", width: "100%", boxSizing: "border-box"
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
      <div style={{ background: "#1a237e", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <span style={{ color: "#c9a84c", fontSize: 16 }}>★</span>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: "0 8px" }}>IMRAN TRAVELS</span>
          <span style={{ color: "#c9a84c", fontSize: 16 }}>★</span>
          <div style={{ color: "#c5cae9", fontSize: 10, letterSpacing: 2, marginTop: 2 }}>BOOKING MANAGEMENT SYSTEM</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ key: "form", label: "📝 NEW BOOKING" }, { key: "records", label: "📋 RECORDS" }].map(v => (
            <button key={v.key} onClick={() => setView(v.key)} style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: "2px solid #c9a84c",
              background: view === v.key ? "#c9a84c" : "transparent",
              color: view === v.key ? "#1a237e" : "#c9a84c",
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>

        {view === "form" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 16px rgba(26,35,126,0.08)" }}>
              <h2 style={{ color: "#1a237e", margin: "0 0 20px", fontSize: 17, fontWeight: 800, borderBottom: "2px solid #e8eaf6", paddingBottom: 10 }}>
                🎫 Passenger & Journey Details
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {inp("passengerName", "PASSENGER NAME", "text", "Full name")}
                {inp("ticketNo", "TICKET NO", "text", "e.g. A-20")}
                {inp("busNo", "BUS NO", "text", "e.g. 7035")}
                {inp("journeyDate", "JOURNEY DATE", "date")}
                {sel("from", "FROM (SOURCE)", DESTINATIONS)}
                {sel("to", "TO (DESTINATION)", DESTINATIONS)}
                {sel("pickupPoint", "PICKUP POINT", PICKUP_POINTS)}
                {inp("time", "DEPARTURE TIME", "text", "e.g. 08:30 PM")}
                {inp("amount", "AMOUNT (₹)", "number", "e.g. 800")}
                {sel("paymentMode", "PAYMENT MODE", PAYMENT_MODES)}
              </div>
            </div>

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
              <SeatMap bookedSeats={allBookedSeats} selectedSeats={selectedSeats} onToggle={toggleSeat} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleSubmit} style={{
                padding: "12px 36px", background: "#1a237e", color: "#fff",
                borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
                boxShadow: "0 3px 10px rgba(26,35,126,0.3)"
              }}>🎟️ GENERATE TICKET</button>
            </div>
          </div>
        )}

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
                      {["Ticket No", "Passenger", "From", "To", "Date", "Bus", "Seats", "Seat IDs", "Amount", "Payment", "Action"].map(h => (
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
                        <td style={{ padding: "8px", fontSize: 10 }}>{b.selectedSeats?.join(", ")}</td>
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
