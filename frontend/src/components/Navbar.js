import { Link } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);      // for touch/mobile
  const ddRef = useRef(null);

  // close when clicking/tapping outside (for the click-open case)
  useEffect(() => {
    const onDoc = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">Warehouse System</div>
      <ul className="nav-links">
        <li><Link to="/">Dashboard</Link></li>

        {/* Hover works via CSS; 'open' class is for click/touch */}
        <li className={`dropdown ${open ? 'open' : ''}`} ref={ddRef}>
          <button
            type="button"
            className="dd-trigger"
            onClick={() => setOpen(o => !o)}      // toggle for touch/mobile
            onTouchStart={() => setOpen(o => !o)} // ensure touch opens it
          >
            Masters ▾
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/products" onClick={() => setOpen(false)}>Product Master</Link></li>
            <li><Link to="/vendors"  onClick={() => setOpen(false)}>Vendor Master</Link></li>
          </ul>
        </li>

        <li><Link to="/purchase-orders">Purchase Orders</Link></li>
        <li><Link to="/grn">GRN</Link></li>
        <li><Link to="/invoices">Purchase Invoices</Link></li>
      </ul>
    </nav>
  );
}
