from flask import Blueprint, jsonify, request
from database.db import get_db_connection

grn_bp = Blueprint('grn', __name__)

@grn_bp.route('/grn', methods=['GET'])
def get_grns():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM grns;')
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

@grn_bp.route('/grn', methods=['POST'])
def add_grn():
    data = request.get_json()
    po_id = data['po_id']
    items = data['items']

    conn = get_db_connection()
    cur = conn.cursor()

    # Get PO items (product_id -> qty, rate)
    cur.execute("SELECT product_id, qty, rate FROM po_items WHERE po_id=%s", (po_id,))
    po_items = {str(row[0]): {'qty': row[1], 'rate': float(row[2])} for row in cur.fetchall()}

    # Validation
    for item in items:
        product_id = str(item['product_id'])
        received_qty = int(item['received_qty'])
        mrp = float(item.get('rate', po_items.get(product_id, {}).get('rate', 0)))

        if product_id not in po_items:
            return jsonify({'error': f'Product {product_id} is not part of PO {po_id}'}), 400

        if received_qty > po_items[product_id]['qty']:
            return jsonify({'error': f'Received qty for product {product_id} exceeds PO quantity'}), 400
        
        if mrp > po_items[product_id]['rate'] * 1.2:
            return jsonify({'error': f'MRP for product {product_id} exceeds 20% of previous purchase price'}), 400

    # Insert GRN
    cur.execute('INSERT INTO grns (po_id, received_date, status) VALUES (%s, %s, %s) RETURNING grn_id',
                (po_id, data['received_date'], data['status']))
    grn_id = cur.fetchone()[0]

    for item in items:
        cur.execute('INSERT INTO grn_items (grn_id, product_id, received_qty, batch_no, expiry) VALUES (%s, %s, %s, %s, %s)',
                    (grn_id, item['product_id'], item['received_qty'], item['batch_no'], item['expiry']))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': f'GRN {grn_id} created successfully'})
