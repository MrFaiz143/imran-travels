import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zushqnhlpuipxtwrtzrl.supabase.co";
const SUPABASE_KEY = "sb_publishable_KRQXcNmugL-T6M_PZowRlA_WiwQGH3X";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const VALID_USERNAME = "Imran_Chaus";
const VALID_PASSWORD = "Imran@467";

const DESTINATIONS = [
  "Surat", "Nashik", "Aurangabad", "Gevrai", "Beed", "Jalna", "Latur",
  "Solapur", "Parbhani", "Nanded", "Mumbai", "Pune", "Ahmednagar",
  "Bhiwandi", "Nagpur", "Ahmedabad", "Amravati", "Akola", "Chikli",
  "Buldhana", "Washim", "Mehkar", "Jalgaon", "Bhusawal", "Jaipur",
  "Ajmer", "Bangalore", "Hyderabad", "Malegaon", "kaij", "Ambajogai",
  "Baroda","Bharuch","Ankleshwar","Manjar sumba"
];

const PAYMENT_MODES = ["Cash Lena He", "Online"];

const PICKUP_POINTS = [
  "Sardar Market Parsi Panchayat Parking",
  "Kadodra Nilam Hotel",
  "Palsana Sabar Hotel",
  "Navsari",
  "Chikhli",
  "Khaja Complex Parking",
  "Hirapur",
  "Padalsinghi",
  "Gadi Fhata",
  "Gevrai Zamzam Bypass",
  "Shahagad",
  "Pachod",
  "Aurangabad",
  "Gangapur",
  "kaij",
  "Ahmedabad",
  "Baroda",
  "Bharuch",
  "Ankleshawr",
  "Manjar sumba",
  "Ambajogai",
  "Latur",
  "Aurangabad Mandir",
  "Waluj",
  "Nashik"
];

function formatDate(dateStr) {
  if (!dateStr) return "--";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatSeats(seats) {
  if (!seats) return "--";
  const arr = typeof seats === "string" ? JSON.parse(seats) : seats;
  return arr?.join(", ") || "--";
}

function countPassengers(seats) {
  if (!seats) return 0;
  const arr = typeof seats === "string" ? JSON.parse(seats) : seats;
  return arr.reduce((total, seat) => total + (seat.includes("-") ? 2 : 1), 0);
}

function LoginPage({ onLogin }) {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (loginForm.username === VALID_USERNAME && loginForm.password === VALID_PASSWORD) {
      sessionStorage.setItem("imran_auth", "true");
      onLogin();
    } else {
      setLoginError("❌ Galat Username ya Password!");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "40px 36px", width: 380,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center"
      }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#1a237e" }}>⭐ IMRAN TRAVELS ⭐</div>
          <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, fontWeight: 600, marginTop: 4 }}>BOOKING MANAGEMENT SYSTEM</div>
        </div>
        <hr style={{ border: "none", borderTop: "2px solid #e8eaf6", margin: "0 0 20px" }} />
        <div style={{ fontSize: 16, fontWeight: 800, color: "#1a237e", marginBottom: 20 }}>🔐 Agent Login</div>

        <div style={{ marginBottom: 14, textAlign: "left" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#1a237e", display: "block", marginBottom: 5 }}>USERNAME</label>
          <input
            type="text" value={loginForm.username} placeholder="Enter username"
            onChange={e => { setLoginForm(f => ({ ...f, username: e.target.value })); setLoginError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "11px 14px", borderRadius: 8, fontSize: 14, border: "1.5px solid #c5cae9", outline: "none", boxSizing: "border-box", background: "#f8f9ff", color: "#222" }}
          />
        </div>

        <div style={{ marginBottom: 20, textAlign: "left" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#1a237e", display: "block", marginBottom: 5 }}>PASSWORD</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"} value={loginForm.password} placeholder="Enter password"
              onChange={e => { setLoginForm(f => ({ ...f, password: e.target.value })); setLoginError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "11px 44px 11px 14px", borderRadius: 8, fontSize: 14, border: "1.5px solid #c5cae9", outline: "none", boxSizing: "border-box", background: "#f8f9ff", color: "#222" }}
            />
            <button onClick={() => setShowPassword(p => !p)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#888"
            }}>{showPassword ? "🙈" : "👁️"}</button>
          </div>
        </div>

        {loginError && (
          <div style={{ background: "#ffebee", color: "#c62828", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
            {loginError}
          </div>
        )}

        <button onClick={handleLogin} style={{
          width: "100%", padding: "12px", background: "#1a237e", color: "#fff",
          borderRadius: 8, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(26,35,126,0.3)"
        }}>🚀 LOGIN</button>

        <div style={{ marginTop: 20, fontSize: 11, color: "#aaa" }}>Imran Travels © 2026</div>
      </div>
    </div>
  );
}

function TicketPrint({ booking }) {
  const seats = typeof booking.selected_seats === "string"
    ? JSON.parse(booking.selected_seats)
    : booking.selected_seats;

  return (
    <div id="ticket-print" style={{
      fontFamily: "'Arial', sans-serif", width: 800, background: "#fff",
      display: "flex", border: "2px solid #1a237e", borderRadius: 8,
      overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 20px 12px", borderBottom: "2px solid #e8eaf6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 850, color: "#1a237e" }}>⭐ IMRAN TRAVELS ⭐</div>
            <div style={{ fontSize: 18, color: "#e20a0a", fontWeight: 900, marginTop: 10 }}>
              Ticket No: {booking.ticket_no || "--"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "#1a237e", fontWeight: 700 }}>📞 CONTACT</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1a237e" }}>7984061265 | 9824151616 | 9824720467</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.7fr 1.1fr", borderBottom: "1px solid #e8eaf6" }}>
          <div style={{ padding: "8px 12px", borderRight: "1px solid #e8eaf6" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#1a237e" }}>1. PASSENGER NAME</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a237e", marginTop: 3 }}>{booking.passenger_name || "--"}</div>
          </div>
          <div style={{ padding: "8px 12px", borderRight: "1px solid #e8eaf6" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#1a237e" }}>2. BUS NO</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#c62828", marginTop: 3 }}>{booking.bus_no || "--"}</div>
          </div>
          <div style={{ padding: "8px 12px", borderRight: "1px solid #e8eaf6" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#1a237e" }}>3. TOTAL PERSONS</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a237e", marginTop: 3 }}>{booking.total_persons || "--"}</div>
          </div>
          <div style={{ padding: "8px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#1a237e" }}>4. SEAT NO</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a237e", marginTop: 3 }}>{formatSeats(seats)}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #e8eaf6" }}>
          <div style={{ padding: "8px 12px", borderRight: "1px solid #e8eaf6" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#1a237e" }}>5. JOURNEY DATE</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a237e", marginTop: 3 }}>{formatDate(booking.journey_date)}</div>
          </div>
          <div style={{ padding: "8px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#1a237e" }}>6. AMOUNT</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a237e", marginTop: 3 }}>₹{booking.amount || "--"}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #e8eaf6" }}>
          <div style={{ padding: "8px 12px", borderRight: "1px solid #e8eaf6" }}>
            <div style={{ fontSize: 9, color: "#1a237e", fontWeight: 700 }}>📍 FROM</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{booking.from_city || "--"}</div>
            <div style={{ fontSize: 9, color: "#1a237e", fontWeight: 700, marginTop: 5 }}>📍 TO</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{booking.to_city || "--"}</div>
          </div>
          <div style={{ padding: "8px 12px", borderRight: "1px solid #e8eaf6" }}>
            <div style={{ fontSize: 9, color: "#1a237e", fontWeight: 700 }}>📅 DATE</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{formatDate(booking.journey_date)}</div>
            <div style={{ fontSize: 9, color: "#1a237e", fontWeight: 700, marginTop: 5 }}>⏰ TIME</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{booking.time || "--"}</div>
          </div>
          <div style={{ padding: "8px 12px" }}>
            <div style={{ fontSize: 9, color: "#1a237e", fontWeight: 700 }}>👤 BOOKING BY</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>Imran Travels</div>
            <div style={{ fontSize: 9, color: "#1a237e", fontWeight: 700, marginTop: 5 }}>💳 PAYMENT</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{booking.payment_mode || "--"}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #e8eaf6" }}>
          <div style={{ padding: "8px 12px", borderRight: "1px solid #e8eaf6" }}>
            <div style={{ fontSize: 9, color: "#1a237e", fontWeight: 700 }}>📌 PICKUP POINT</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{booking.pickup_point || "--"}</div>
          </div>
          <div style={{ padding: "8px 12px" }}>
            <div style={{ fontSize: 9, color: "#1a237e", fontWeight: 700 }}>🚌 JOURNEY BY</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: "#c62828" }}>Shihori Travels</div>
          </div>
        </div>

        <div style={{ padding: "10px 20px", borderBottom: "1px solid #e8eaf6", textAlign: "center" }}>
          <h2 style={{ fontSize: 25, fontWeight: 700, color: "#1a237e", marginTop: 6 }}>Terms & Conditions</h2>
          <p style={{ fontSize: 15, color: "#555",textAlign: "left", marginTop: 4 }}><b>1. Bus operators are not responsible for any Damage or luggage and commercial Goods.</b></p>
          <p style={{ fontSize: 15, color: "#555", textAlign: "left", marginTop: 4 }}><b>2. Management will not responsible for any injury to passengers and damage to their property due to accident of any oher case.</b></p>
          <p style={{ fontSize: 15, color: "#555", textAlign: "left", marginTop: 4 }}><b>3. The agency will not be responsible for any loss of passenger's property.</b></p>
        </div>

        <div style={{ background: "#1a237e", padding: "8px 0", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c" }}>Thank you for booking with Imran Travels</div>
        </div>
      </div>

      <div style={{ width: 1, background: "repeating-linear-gradient(to bottom, #1a237e 0px, #1a237e 8px, transparent 8px, transparent 14px)" }} />

      <div style={{ width: 210, display: "flex", flexDirection: "column", background: "#fff" }}>
        <div style={{ background: "#1a237e", padding: "12px 10px", textAlign: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>⭐ IMRAN TRAVELS ⭐</span>
        </div>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #e8eaf6", textAlign: "center" }}>
          <div style={{ fontSize: 8, fontWeight: 650, color: "#1a237e", marginBottom: 3 }}>PASSENGER NAME</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#1a237e" }}>{booking.passenger_name || "--"}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #e8eaf6" }}>
          <div style={{ padding: "8px 10px", borderRight: "1px solid #e8eaf6" }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>BUS NO</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{booking.bus_no || "--"}</div>
          </div>
          <div style={{ padding: "8px 10px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>SEAT NO</div>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{formatSeats(seats)}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #e8eaf6" }}>
          <div style={{ padding: "8px 10px", borderRight: "1px solid #e8eaf6" }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>JOURNEY DATE</div>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{formatDate(booking.journey_date)}</div>
          </div>
          <div style={{ padding: "8px 10px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>JOURNEY</div>
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{booking.to_city || "--"}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #e8eaf6" }}>
          <div style={{ padding: "8px 10px", borderRight: "1px solid #e8eaf6" }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>TOTAL SEAT</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{booking.total_persons || countPassengers(seats) || "--"}</div>
          </div>
          <div style={{ padding: "8px 10px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#1a237e" }}>AMOUNT</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>₹{booking.amount || "--"}</div>
          </div>
        </div>
        <div style={{ padding: "8px 12px", flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 650, color: "#1a237e", marginBottom: 8 }}>🚌 OUR ROUTES</div>
          {[
            "Surat → Gevrai - Jalna ",
            "Surat → Malegaon - Aurangabad - Beed - Kej - Ambajogai - Latur",
            "Surat → Chikli - Buldhana - Mehkar - Washim",
            "Surat → Mumbai - Pune - Ahemdabad, Baroda - Bharuch",
            "Surat → Akola - Amravati - Yavatmal - Nagpur",
            "Surat → Jaipur - Rajasthan - Ajmer -Bangalore - Hyderabad",
          ].map((r, i) => (
            <div key={i} style={{ fontSize: 9, color: "#333", padding: "2px 0", borderBottom: "1px dashed #e8eaf6", lineHeight: 1.4 }}>
              {i + 1}. {r}
            </div>
          ))}
          
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#120988", textAlign: "center", marginTop: 50 }}>Return Ticket Available.</h2>
        </div>
        <div style={{ background: "#1a237e", padding: "8px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#c9a84c", fontWeight: 700 }}>HAVE A SAFE JOURNEY!</div>
        </div>
      </div>
    </div>
  );
}



const emptyForm = {
  passengerName: "", ticketNo: "", busNo: "", journeyDate: "",
  from: "", to: "", pickupPoint: "", time: "", amount: "", paymentMode: "Cash Lena He",
  manualSeatNo: "", totalPersons: ""
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("imran_auth") === "true");
  const [view, setView] = useState("form");
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatPersons, setSeatPersons] = useState({});
  const [bookings, setBookings] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isLoggedIn) loadBookings();
  }, [isLoggedIn]);

  const loadBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setBookings(data);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("imran_auth");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const allBookedSeats = bookings.flatMap(b => {
    try { return typeof b.selected_seats === "string" ? JSON.parse(b.selected_seats) : b.selected_seats || []; }
    catch { return []; }
  });

  const toggleSeat = (seatId, persons) => {
    if (persons === 0 || selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
      setSeatPersons(prev => { const n = {...prev}; delete n[seatId]; return n; });
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
      setSeatPersons(prev => ({ ...prev, [seatId]: persons }));
    }
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
    if (!form.manualSeatNo.trim()) e.seats = "Seat No likhna zaroori hai";
    if (!form.totalPersons) e.totalPersons = "Total Persons likhna zaroori hai";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    const finalSeats = form.manualSeatNo.split(",").map(s => s.trim());
    const totalPersons = parseInt(form.totalPersons) || finalSeats.reduce((a, s) => a + (s.includes("-") ? 2 : 1), 0);
    const record = {
      passenger_name: form.passengerName,
      ticket_no: form.ticketNo,
      bus_no: form.busNo,
      journey_date: form.journeyDate,
      from_city: form.from,
      to_city: form.to,
      pickup_point: form.pickupPoint,
      time: form.time,
      amount: form.amount,
      payment_mode: form.paymentMode,
      selected_seats: JSON.stringify(finalSeats),
      booked_at: new Date().toISOString(),
      total_persons: totalPersons
    };
    const { data, error } = await supabase.from("bookings").insert([record]).select();
    if (!error && data) {
      setCurrentTicket({ ...data[0], seatPersons });
      setBookings(prev => [data[0], ...prev]);
      setSelectedSeats([]);
      setSeatPersons({});
      setView("ticket");
      setForm({ ...emptyForm });
      setErrors({});
    } else {
      alert("Error saving booking! " + error?.message);
    }
    setSaving(false);
  };

  const handleShare = async () => {
    const element = document.getElementById("ticket-print");
    const canvas = await html2canvas(element, { scale: 1, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    const pdfBlob = pdf.output("blob");
    const file = new File([pdfBlob], `Ticket-${currentTicket.ticket_no}.pdf`, { type: "application/pdf" });
    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Imran Travels - Ticket ${currentTicket.ticket_no}`,
          text: `🎫 Ticket No: ${currentTicket.ticket_no}\n👤 ${currentTicket.passenger_name}\n📍 ${currentTicket.from_city} → ${currentTicket.to_city}\n📅 ${formatDate(currentTicket.journey_date)}`,
          files: [file]
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      pdf.save(`Ticket-${currentTicket.ticket_no}.pdf`);
      alert("Sharing not supported on this device. PDF downloaded instead!");
    }
  };

  const handlePrint = async () => {
    const element = document.getElementById("ticket-print");
    const canvas = await html2canvas(element, { scale: 1, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`Ticket-${currentTicket.ticket_no}.pdf`);
  };

  const inp = (field, label, type = "text", placeholder = "") => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#1a237e" }}>{label}</label>
      <input type={type} value={form[field]} placeholder={placeholder}
        onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: "" })); }}
        style={{ padding: "9px 12px", borderRadius: 6, fontSize: 13, border: errors[field] ? "1.5px solid #e53935" : "1.5px solid #c5cae9", outline: "none", background: "#f8f9ff", color: "#222", width: "100%", boxSizing: "border-box" }}
      />
      {errors[field] && <span style={{ fontSize: 10, color: "#e53935" }}>{errors[field]}</span>}
    </div>
  );

  const sel = (field, label, options) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#1a237e" }}>{label}</label>
      <select value={form[field]} onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: "" })); }}
        style={{ padding: "9px 12px", borderRadius: 6, fontSize: 13, border: errors[field] ? "1.5px solid #e53935" : "1.5px solid #c5cae9", outline: "none", background: "#f8f9ff", color: "#222", width: "100%", boxSizing: "border-box" }}>
        <option value="">-- Select --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[field] && <span style={{ fontSize: 10, color: "#e53935" }}>{errors[field]}</span>}
    </div>
  );

  const filtered = bookings.filter(b =>
    b.passenger_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.ticket_no?.toLowerCase().includes(search.toLowerCase()) ||
    b.from_city?.toLowerCase().includes(search.toLowerCase()) ||
    b.to_city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#eef0fb", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#1a237e", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <span style={{ color: "#c9a84c" }}>★</span>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: "0 8px" }}>IMRAN TRAVELS</span>
          <span style={{ color: "#c9a84c" }}>★</span>
          <div style={{ color: "#c5cae9", fontSize: 10, letterSpacing: 2, marginTop: 2 }}>BOOKING MANAGEMENT SYSTEM</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[{ key: "form", label: "📝 NEW BOOKING" }, { key: "records", label: "📋 RECORDS" }].map(v => (
            <button key={v.key} onClick={() => { setView(v.key); if(v.key==="records") loadBookings(); }} style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: "2px solid #c9a84c", background: view === v.key ? "#c9a84c" : "transparent", color: view === v.key ? "#1a237e" : "#c9a84c"
            }}>{v.label}</button>
          ))}
          <button onClick={handleLogout} style={{
            padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
            border: "2px solid #ef5350", background: "transparent", color: "#ef5350"
          }}>🚪 Logout</button>
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
              <div style={{ marginTop: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#1a237e" }}>SEAT NO *</label>
                <input type="text" value={form.manualSeatNo} placeholder="e.g. 17-18 ya A, B, 3-4"
                  onChange={e => { setForm(f => ({ ...f, manualSeatNo: e.target.value })); setErrors(er => ({ ...er, seats: "" })); }}
                  style={{ padding: "9px 12px", borderRadius: 6, fontSize: 13, border: errors.seats ? "1.5px solid #e53935" : "1.5px solid #c5cae9", outline: "none", background: "#f8f9ff", color: "#222", width: "100%", boxSizing: "border-box", marginTop: 4 }}
                />
                {errors.seats && <span style={{ fontSize: 10, color: "#e53935" }}>{errors.seats}</span>}
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#1a237e" }}>TOTAL PERSONS *</label>
                <input type="number" value={form.totalPersons} placeholder="e.g. 1, 2, 3"
                  onChange={e => { setForm(f => ({ ...f, totalPersons: e.target.value })); setErrors(er => ({ ...er, totalPersons: "" })); }}
                  style={{ padding: "9px 12px", borderRadius: 6, fontSize: 13, border: errors.totalPersons ? "1.5px solid #e53935" : "1.5px solid #c5cae9", outline: "none", background: "#f8f9ff", color: "#222", width: "100%", boxSizing: "border-box", marginTop: 4 }}
                />
                {errors.totalPersons && <span style={{ fontSize: 10, color: "#e53935" }}>{errors.totalPersons}</span>}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleSubmit} disabled={saving} style={{
                padding: "12px 36px", background: saving ? "#9fa8da" : "#1a237e", color: "#fff",
                borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 3px 10px rgba(26,35,126,0.3)"
              }}>{saving ? "⏳ Saving..." : "🎟️ GENERATE TICKET"}</button>
            </div>
          </div>
        )}

        {view === "ticket" && currentTicket && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ color: "#1a237e", margin: 0, fontWeight: 800 }}>✅ Ticket Generated!</h2>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setView("form")} style={{ padding: "9px 20px", background: "#e8eaf6", color: "#1a237e", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>+ New Booking</button>
                <button onClick={handlePrint} style={{ padding: "9px 20px", background: "#1a237e", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>🖨️ Download PDF</button>
                <button onClick={handleShare} style={{ padding: "9px 20px", background: "#25D366", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>📤 Share PDF</button>
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
              <input placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: "8px 14px", borderRadius: 20, border: "1.5px solid #c5cae9", fontSize: 13, width: 240, outline: "none" }} />
            </div>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#9fa8da" }}>⏳ Loading bookings...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", color: "#9fa8da", padding: 40 }}>No bookings found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#e8eaf6" }}>
                      {["Ticket No","Passenger","From","To","Date","Bus","Persons","Seats","Amount","Payment","Action"].map(h => (
                        <th key={h} style={{ padding: "10px 8px", textAlign: "left", color: "#1a237e", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b, i) => {
                      const seats = typeof b.selected_seats === "string" ? JSON.parse(b.selected_seats) : b.selected_seats || [];
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #e8eaf6", background: i % 2 === 0 ? "#fff" : "#f8f9ff" }}>
                          <td style={{ padding: "8px", fontWeight: 700, color: "#3949ab", fontSize: 10 }}>{b.ticket_no}</td>
                          <td style={{ padding: "8px" }}>{b.passenger_name}</td>
                          <td style={{ padding: "8px" }}>{b.from_city}</td>
                          <td style={{ padding: "8px" }}>{b.to_city}</td>
                          <td style={{ padding: "8px" }}>{formatDate(b.journey_date)}</td>
                          <td style={{ padding: "8px" }}>{b.bus_no}</td>
                          <td style={{ padding: "8px", textAlign: "center" }}>{b.total_persons || countPassengers(seats)}</td>
                          <td style={{ padding: "8px", fontSize: 10 }}>{seats.join(", ")}</td>
                          <td style={{ padding: "8px", fontWeight: 700 }}>₹{b.amount}</td>
                          <td style={{ padding: "8px" }}>{b.payment_mode}</td>
                          <td style={{ padding: "8px" }}>
                            <button onClick={() => { setCurrentTicket(b); setView("ticket"); }} style={{ padding: "5px 10px", background: "#1a237e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>View</button>
                          </td>
                        </tr>
                      );
                    })}
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
