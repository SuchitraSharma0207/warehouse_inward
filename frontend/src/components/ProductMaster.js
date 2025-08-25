import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductMaster() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search/filter state
  const [filters, setFilters] = useState({ name: "", category: "", status: "" });

  // Add/Edit form state
  const [form, setForm] = useState({
    product_code: "",
    product_name: "",
    category: "",
    hsn_code: "",
    status: "Active"
  });

  // Fetch Products (with optional filters)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = `http://127.0.0.1:5000/products/search?name=${filters.name}&category=${filters.category}&status=${filters.status}`;
      const res = await axios.get(query);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  // Handle search inputs
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle Add Product form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/products", form, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Product added successfully");
      setForm({ product_code: "", product_name: "", category: "", hsn_code: "", status: "Active" });
      setShowForm(false);
      fetchProducts(); // refresh table
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product");
    }
  };

  // Fetch data initially
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Master</h2>

      {/* Search Filters */}
      <div style={{ marginBottom: "15px" }}>
        <input name="name" placeholder="Search by Name" value={filters.name} onChange={handleFilterChange} />
        <input name="category" placeholder="Search by Category" value={filters.category} onChange={handleFilterChange} />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={fetchProducts}>Search</button>
        <button 
          style={{ background: "#32cd32", color: "white", padding: "6px 12px", border: "none", marginLeft: "10px" }}
          onClick={() => setShowForm(true)}
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ background: "#1e90ff", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>HSN</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p, idx) => (
                <tr key={idx}>
                  <td>{p[0]}</td>
                  <td>{p[1]}</td>
                  <td>{p[2]}</td>
                  <td>{p[3]}</td>
                  <td>{p[4]}</td>
                  <td>{p[5]}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>No products found</td></tr>
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
            <h3>Add Product</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="product_code" placeholder="Product Code" value={form.product_code} onChange={handleChange} required style={{ width: "100%", margin: "5px 0" }} />
              <input type="text" name="product_name" placeholder="Product Name" value={form.product_name} onChange={handleChange} required style={{ width: "100%", margin: "5px 0" }} />
              <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} style={{ width: "100%", margin: "5px 0" }} />
              <input type="text" name="hsn_code" placeholder="HSN Code" value={form.hsn_code} onChange={handleChange} style={{ width: "100%", margin: "5px 0" }} />
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
