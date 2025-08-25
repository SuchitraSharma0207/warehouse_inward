from flask import Blueprint, jsonify
from database.db import get_db_connection

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/summary', methods=['GET'])
def dashboard_summary():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('SELECT COUNT(*) FROM products')
    total_products = cur.fetchone()[0]

    cur.execute('SELECT COUNT(*) FROM vendors')
    total_vendors = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM purchase_orders WHERE status IN ('Pending', 'Partially Received')")
    pending_pos = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM invoices WHERE status='Pending'")
    pending_invoices = cur.fetchone()[0]

    cur.close()
    conn.close()

    return jsonify({
        'products': total_products,
        'vendors': total_vendors,
        'pending_pos': pending_pos,
        'pending_invoices': pending_invoices
    })


@dashboard_bp.route('/dashboard/recent-activity', methods=['GET'])
def recent_activity():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT po_id, vendor_id, status, po_date FROM purchase_orders ORDER BY po_date DESC LIMIT 5")
    recent_pos = cur.fetchall()

    cur.execute("SELECT grn_id, po_id, status, received_date FROM grns ORDER BY received_date DESC LIMIT 5")
    recent_grns = cur.fetchall()

    cur.execute("SELECT pi_id, grn_id, status, invoice_date FROM invoices ORDER BY invoice_date DESC LIMIT 5")
    recent_invoices = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify({
        'recent_pos': recent_pos,
        'recent_grns': recent_grns,
        'recent_invoices': recent_invoices
    })
