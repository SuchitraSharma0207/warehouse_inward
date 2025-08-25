import { useEffect, useState } from "react";
import axios from "axios";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [grns, setGRNs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const initialForm = {
    grn_id: "",
    invoice_date: "",
    total_amount: "",
    status: "Pending",
  };

  const [form, setForm] = useState(initialForm);

  // Fetch all invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
    setLoading(false);
  };

  // Fetch GRNs for dropdown (only completed ones ideally)
  const fetchGRNs = async () => {
    const res = await axios.get("http://127.0.0.1:5000/grn");
    setGRNs(res.data);
  };

  // Submit new invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/invoices", form, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Invoice created successfully");
      closeForm();
      fetchInvoices();
    } catch (err) {
      console.error("Error creating invoice:", err);
      alert(err.response?.data?.error || "Failed to create invoice");
    }
  };

  // Update invoice status
  const updateStatus = async (pi_id, status) => {
    try {
      await axios.put(`http://127.0.0.1:5000/invoices/${pi_id}/status`, { status });
      fetchInvoices();
    } catch (err) {
      console.error("Error updating invoice status:", err);
    }
  };

  // Modal controls
  const openForm = () => {
    setForm(initialForm);
    setShowForm(true);
  };

  const closeForm = () => {
    setForm(initialForm);
    setShowForm(false);
  };

  useEffect(() => {
    fetchInvoices();
    fetchGRNs();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Purchase Invoices</h2>

      <button
        style={{ background: "#32cd32", color: "white", padding: "6px 12px", border: "none", marginBottom: "15px" }}
        onClick={openForm}
      >
        + Add Invoice
      </button>

      {/* Invoice Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ background: "#1e90ff", color: "white" }}>
            <tr>
              <th>PI ID</th>
              <th>GRN ID</th>
              <th>Invoice Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((inv, idx) => (
                <tr key={idx}>
                  <td>{inv[0]}</td>
                  <td>{inv[1]}</td>
                  <td>{inv[2]}</td>
                  <td>{inv[3]}</td>
                  <td>{inv[4]}</td>
                  <td>
                    {inv[4] === "Pending" && (
                      <>
                        <button onClick={() => updateStatus(inv[0], "Approved")} style={{ marginRight: "5px" }}>
                          Approve
                        </button>
                        <button onClick={() => updateStatus(inv[0], "Rejected")}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>No invoices found</td></tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal Form */}
      {showForm && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px" }}>
            <h3>Create Invoice</h3>
            <form onSubmit={handleSubmit}>
              <select
                name="grn_id"
                value={form.grn_id}
                onChange={(e) => setForm({ ...form, grn_id: e.target.value })}
                required
                style={{ width: "100%", margin: "5px 0" }}
              >
                <option value="">Select GRN</option>
                {grns.map((g) => (
                  <option key={g[0]} value={g[0]}>GRN #{g[0]} (PO {g[1]})</option>
                ))}
              </select>
              <input
                type="date"
                name="invoice_date"
                value={form.invoice_date}
                onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
                required
                style={{ width: "100%", margin: "5px 0" }}
              />
              <input
                type="number"
                placeholder="Total Amount"
                name="total_amount"
                value={form.total_amount}
                onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
                required
                style={{ width: "100%", margin: "5px 0" }}
              />

              <div style={{ textAlign: "right", marginTop: "10px" }}>
                <button type="button" onClick={closeForm} style={{ marginRight: "10px" }}>Cancel</button>
                <button type="submit" style={{ background: "#1e90ff", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px" }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
