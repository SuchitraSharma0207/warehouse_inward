import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [recentPOs, setRecentPOs] = useState([]);
  const [recentGRNs, setRecentGRNs] = useState([]);
  const [recentPIs, setRecentPIs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const summaryRes = await axios.get("http://127.0.0.1:5000/dashboard/summary");
      const recentRes = await axios.get("http://127.0.0.1:5000/dashboard/recent-activity");

      setSummary(summaryRes.data);
      setRecentPOs(recentRes.data.recent_pos || []);
      setRecentGRNs(recentRes.data.recent_grns || []);
      setRecentPIs(recentRes.data.recent_invoices || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading Dashboard...</p>;

  // Flow percentages
  const totalFlow = (summary.pending_pos || 0) + recentGRNs.length + recentPIs.length || 1;
  const poPercent = ((summary.pending_pos || 0) / totalFlow) * 100;
  const grnPercent = (recentGRNs.length / totalFlow) * 100;
  const piPercent = (recentPIs.length / totalFlow) * 100;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
    <div className="container mt-4">
      {/* Summary Cards 2 by 2 */}
      <div className="row mb-4">
        {["Products", "Vendors", "Pending POs", "Pending Invoices"].map((title, idx) => {
          let value = 0;
          if (title === "Products") value = summary.products;
          else if (title === "Vendors") value = summary.vendors;
          else if (title === "Pending POs") value = summary.pending_pos;
          else if (title === "Pending Invoices") value = summary.pending_invoices;

          return (
            <div className="col-md-6 mb-3" key={idx}> {/* 2 per row */}
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{title}</h5>
                  <p className="card-text display-6">{value || 0}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow Status with increased width */}
      <div className="mb-4">
        <h5>Flow Status</h5>
        <div className="d-flex justify-content-between mb-2">
          <div>Pending POs: {summary.pending_pos || 0}</div>
          <div>GRNs: {recentGRNs.length}</div>
          <div>PIs: {recentPIs.length}</div>
        </div>
        <div className="progress" style={{ height: "40px" }}> {/* increased height */}
          <div
            className="progress-bar bg-primary"
            style={{ width: `${poPercent}%`, fontWeight: "bold" }}
          >
            PO ({summary.pending_pos || 0})
          </div>
          <div
            className="progress-bar bg-warning"
            style={{ width: `${grnPercent}%`, fontWeight: "bold" }}
          >
            GRN ({recentGRNs.length})
          </div>
          <div
            className="progress-bar bg-success"
            style={{ width: `${piPercent}%`, fontWeight: "bold" }}
          >
            PI ({recentPIs.length})
          </div>
        </div>
      </div>
      </div>
      </div>
  );
}
