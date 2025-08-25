import { useEffect, useState } from "react";
import axios from "axios";

export default function GRN() {
  const [grns, setGrns] = useState([]);
  const [pos, setPOs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const initialForm = {
    po_id: "",
    received_date: "",
    status: "Pending",
    items: [{ product_id: "", received_qty: "", batch_no: "", expiry: "" }],
  };

  const [form, setForm] = useState(initialForm);

  // Fetch GRNs
  const fetchGRNs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/grn");
      setGrns(res.data);
    } catch (err) {
      console.error("Error fetching GRNs:", err);
    }
    setLoading(false);
  };

  // Fetch POs & Products for dropdowns
  const fetchPOs = async () => {
    const res = await axios.get("http://127.0.0.1:5000/purchase-orders");
    setPOs(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get("http://127.0.0.1:5000/products");
    setProducts(res.data);
  };

  // Submit GRN
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/grn", form, {
        headers: { "Content-Type": "application/json" },
      });
      alert("GRN created successfully");
      closeForm();
      fetchGRNs();
    } catch (err) {
      console.error("Error creating GRN:", err);
      alert(err.response?.data?.error || "Failed to create GRN");
    }
  };

  // Add one item row at a time
  const addItemRow = () => {
    setForm((prevForm) => ({
      ...prevForm,
      items: [...prevForm.items, { product_id: "", received_qty: "", batch_no: "", expiry: "" }],
    }));
  };

  // Handle item input change
  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  // Open & Reset Modal
  const openForm = () => {
    setForm(initialForm);
    setShowForm(true);
  };

  // Close Modal
  const closeForm = () => {
    setForm(initialForm);
    setShowForm(false);
  };

  useEffect(() => {
    fetchGRNs();
    fetchPOs();
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Goods Receipt Notes (GRN)</h2>

      <button
        style={{ background: "#32cd32", color: "white", padding: "6px 12px", border: "none", marginBottom: "15px" }}
        onClick={openForm}
      >
        + Generate GRN
      </button>

      {/* GRN Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ background: "#1e90ff", color: "white" }}>
            <tr>
              <th>GRN ID</th>
              <th>PO ID</th>
              <th>Received Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {grns.length > 0 ? (
              grns.map((g, idx) => (
                <tr key={idx}>
                  <td>{g[0]}</td>
                  <td>{g[1]}</td>
                  <td>{g[2]}</td>
                  <td>{g[3]}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ textAlign: "center" }}>No GRNs found</td></tr>
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
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "500px" }}>
            <h3>Generate GRN</h3>
            <form onSubmit={handleSubmit}>
              <select
                name="po_id"
                value={form.po_id}
                onChange={(e) => setForm({ ...form, po_id: e.target.value })}
                required
                style={{ width: "100%", margin: "5px 0" }}
              >
                <option value="">Select PO</option>
                {pos.map((p) => (
                  <option key={p[0]} value={p[0]}>PO #{p[0]} - Vendor {p[1]}</option>
                ))}
              </select>
              <input
                type="date"
                name="received_date"
                value={form.received_date}
                onChange={(e) => setForm({ ...form, received_date: e.target.value })}
                required
                style={{ width: "100%", margin: "5px 0" }}
              />

              <h4>Items</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {form.items.map((item, index) => (
                  <div key={index} style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    <select
                      value={item.product_id}
                      onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
                      required
                    >
                      <option value="">Product</option>
                      {products.map((p) => (
                        <option key={p[0]} value={p[0]}>{p[2]}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Received Qty"
                      value={item.received_qty}
                      onChange={(e) => handleItemChange(index, "received_qty", e.target.value)}
                      required
                      style={{ width: "90px" }}
                    />
                    <input
                      type="text"
                      placeholder="Batch No"
                      value={item.batch_no}
                      onChange={(e) => handleItemChange(index, "batch_no", e.target.value)}
                      required
                      style={{ width: "90px" }}
                    />
                    <input
                      type="date"
                      placeholder="Expiry"
                      value={item.expiry}
                      onChange={(e) => handleItemChange(index, "expiry", e.target.value)}
                      required
                      style={{ width: "130px" }}
                    />
                  </div>
                ))}
              </div>
              <button type="button" onClick={addItemRow} style={{ marginTop: "8px" }}>+ Add Item</button>

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
