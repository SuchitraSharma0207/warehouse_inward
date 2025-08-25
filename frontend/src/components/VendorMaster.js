import { useEffect, useState } from "react";
import axios from "axios";

export default function VendorMaster() {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search/filter state
  const [filters, setFilters] = useState({ name: "", code: "", status: "" });

  // Add/Edit form state
  const [form, setForm] = useState({
    vendor_code: "",
    vendor_name: "",
    contact_person: "",
    contact_number: "",
    gst_number: "",
    address: "",
    status: "Active"
  });

  // Fetch vendors (with filters)
  const fetchVendors = async () => {
    setLoading(true);
    try {
      let query = `http://127.0.0.1:5000/vendors/search?name=${filters.name}&code=${filters.code}&status=${filters.status}`;
      const res = await axios.get(query);
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
    setLoading(false);
  };

  // Handle search input
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle Add Vendor form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new vendor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/vendors", form, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Vendor added successfully");
      setForm({
        vendor_code: "",
        vendor_name: "",
        contact_person: "",
        contact_number: "",
        gst_number: "",
        address: "",
        status: "Active"
      });
      setShowForm(false);
      fetchVendors();
    } catch (err) {
      console.error("Error adding vendor:", err);
      alert("Failed to add vendor");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vendor Master</h2>

      {/* Search Filters */}
      <div style={{ marginBottom: "15px" }}>
        <input name="name" placeholder="Search by Name" value={filters.name} onChange={handleFilterChange} />
        <input name="code" placeholder="Search by Code" value={filters.code} onChange={handleFilterChange} />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={fetchVendors}>Search</button>
        <button 
          style={{ background: "#32cd32", color: "white", padding: "6px 12px", border: "none", marginLeft: "10px" }}
          onClick={() => setShowForm(true)}
        >
          + Add Vendor
        </button>
      </div>

      {/* Vendor Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ background: "#1e90ff", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Contact Person</th>
              <th>Contact Number</th>
              <th>GST Number</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length > 0 ? (
              vendors.map((v, idx) => (
                <tr key={idx}>
                  <td>{v[0]}</td>
                  <td>{v[1]}</td>
                  <td>{v[2]}</td>
                  <td>{v[3]}</td>
                  <td>{v[4]}</td>
                  <td>{v[5]}</td>
                  <td>{v[6]}</td>
                  <td>{v[7]}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" style={{ textAlign: "center" }}>No vendors found</td></tr>
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
          <div style={{
            background: "white", padding: "20px", borderRadius: "8px", width: "400px"
          }}>
            <h3>Add Vendor</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="vendor_code" placeholder="Vendor Code" value={form.vendor_code} onChange={handleChange} required style={{ width: "100%", margin: "5px 0" }} />
              <input type="text" name="vendor_name" placeholder="Vendor Name" value={form.vendor_name} onChange={handleChange} required style={{ width: "100%", margin: "5px 0" }} />
              <input type="text" name="contact_person" placeholder="Contact Person" value={form.contact_person} onChange={handleChange} style={{ width: "100%", margin: "5px 0" }} />
              <input type="text" name="contact_number" placeholder="Contact Number" value={form.contact_number} onChange={handleChange} style={{ width: "100%", margin: "5px 0" }} />
              <input type="text" name="gst_number" placeholder="GST Number" value={form.gst_number} onChange={handleChange} style={{ width: "100%", margin: "5px 0" }} />
              <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} style={{ width: "100%", margin: "5px 0" }} />
              <select name="status" value={form.status} onChange={handleChange} style={{ width: "100%", margin: "5px 0" }}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div style={{ textAlign: "right" }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ marginRight: "10px" }}>Cancel</button>
                <button type="submit" style={{ background: "#1e90ff", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px" }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
