import { useEffect, useState } from "react";
import axios from "axios";

export default function PurchaseOrders() {
  const [pos, setPos] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");

  // Initial empty form template
  const initialForm = {
    vendor_id: "",
    po_date: "",
    expected_date: "",
    status: "Pending",
    items: [{ product_id: "", qty: "", rate: "" }],
  };

  const [form, setForm] = useState(initialForm);

  // Fetch Purchase Orders
  const fetchPOs = async () => {
    setLoading(true);
    try {
      let url = statusFilter
        ? `http://127.0.0.1:5000/purchase-orders/filter?status=${statusFilter}`
        : `http://127.0.0.1:5000/purchase-orders`;
      const res = await axios.get(url);
      setPos(res.data);
    } catch (err) {
      console.error("Error fetching POs:", err);
    }
    setLoading(false);
  };

  // Fetch Vendors & Products
  const fetchVendors = async () => {
    const res = await axios.get("http://127.0.0.1:5000/vendors");
    setVendors(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get("http://127.0.0.1:5000/products");
    setProducts(res.data);
  };

  // Submit PO
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/purchase-orders", form, {
        headers: { "Content-Type": "application/json" },
      });
      alert("PO created successfully");
      setShowForm(false);
      setForm(initialForm); // Reset form after save
      fetchPOs();
    } catch (err) {
      console.error("Error creating PO:", err);
      alert("Failed to create PO");
    }
  };

  // Cancel PO
  const cancelPO = async (id) => {
    if (window.confirm("Are you sure to cancel this PO?")) {
      await axios.put(`http://127.0.0.1:5000/purchase-orders/${id}/cancel`);
      fetchPOs();
    }
  };

  // Add one item row at a time
  const addItemRow = () => {
    setForm((prevForm) => ({
      ...prevForm,
      items: [...prevForm.items, { product_id: "", qty: "", rate: "" }],
    }));
  };

  // Handle item input change
  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  // Open Modal & Reset Form
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
    fetchPOs();
    fetchVendors();
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Purchase Orders</h2>

      {/* Filter Section */}
      <div style={{ marginBottom: "15px" }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Partially Received">Partially Received</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button onClick={fetchPOs} style={{ marginLeft: "10px" }}>Filter</button>
        <button
          style={{ background: "#32cd32", color: "white", padding: "6px 12px", border: "none", marginLeft: "10px" }}
          onClick={openForm}
        >
          + Create PO
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ background: "#1e90ff", color: "white" }}>
            <tr>
              <th>PO ID</th>
              <th>Vendor ID</th>
              <th>PO Date</th>
              <th>Expected Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pos.length > 0 ? (
              pos.map((p, idx) => (
                <tr key={idx}>
                  <td>{p[0]}</td>
                  <td>{p[1]}</td>
                  <td>{p[2]}</td>
                  <td>{p[3]}</td>
                  <td>{p[4]}</td>
                  <td>
                    {p[4] !== "Cancelled" && (
                      <button onClick={() => cancelPO(p[0])} style={{ background: "red", color: "white" }}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>No POs found</td></tr>
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
            <h3>Create Purchase Order</h3>
            <form onSubmit={handleSubmit}>
              <select name="vendor_id" value={form.vendor_id} onChange={(e) => setForm({ ...form, vendor_id: e.target.value })} required style={{ width: "100%", margin: "5px 0" }}>
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v[0]} value={v[0]}>{v[2]}</option>
                ))}
              </select>
              <input type="date" name="po_date" value={form.po_date} onChange={(e) => setForm({ ...form, po_date: e.target.value })} required style={{ width: "100%", margin: "5px 0" }} />
              <input type="date" name="expected_date" value={form.expected_date} onChange={(e) => setForm({ ...form, expected_date: e.target.value })} required style={{ width: "100%", margin: "5px 0" }} />

              <h4>Items</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {form.items.map((item, index) => (
                  <div key={index} style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    <select value={item.product_id} onChange={(e) => handleItemChange(index, "product_id", e.target.value)} required>
                      <option value="">Product</option>
                      {products.map((p) => (
                        <option key={p[0]} value={p[0]}>{p[2]}</option>
                      ))}
                    </select>
                    <input type="number" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(index, "qty", e.target.value)} required style={{ width: "80px" }} />
                    <input type="number" placeholder="Rate" value={item.rate} onChange={(e) => handleItemChange(index, "rate", e.target.value)} required style={{ width: "80px" }} />
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
