import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProductMaster from './components/ProductMaster';
import VendorMaster from './components/VendorMaster';
import PurchaseOrders from './components/PurchaseOrders';
import GRN from './components/GRN';
import Invoices from './components/Invoices';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductMaster />} />
          <Route path="/vendors" element={<VendorMaster />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/grn" element={<GRN />} />
          <Route path="/invoices" element={<Invoices />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
