from flask import Blueprint, jsonify, request
from database.db import get_db_connection

po_bp = Blueprint('purchase_orders', __name__)

@po_bp.route('/purchase-orders', methods=['GET'])
def get_pos():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM purchase_orders;')
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

@po_bp.route('/purchase-orders', methods=['POST'])
def add_po():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO purchase_orders (vendor_id, po_date, expected_date, status) VALUES (%s, %s, %s, %s) RETURNING po_id',
                (data['vendor_id'], data['po_date'], data['expected_date'], data['status']))
    po_id = cur.fetchone()[0]

    # Insert PO Items
    for item in data['items']:
        cur.execute('INSERT INTO po_items (po_id, product_id, qty, rate) VALUES (%s, %s, %s, %s)',
                    (po_id, item['product_id'], item['qty'], item['rate']))

    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'PO created successfully'})

@po_bp.route('/purchase-orders/filter', methods=['GET'])
def filter_pos():
    status = request.args.get('status', '')
    conn = get_db_connection()
    cur = conn.cursor()
    query = "SELECT * FROM purchase_orders WHERE status ILIKE %s"
    cur.execute(query, (f'%{status}%',))
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

@po_bp.route('/purchase-orders/<int:po_id>/cancel', methods=['PUT'])
def cancel_po(po_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE purchase_orders SET status='Cancelled' WHERE po_id=%s", (po_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': f'PO {po_id} cancelled successfully'})
