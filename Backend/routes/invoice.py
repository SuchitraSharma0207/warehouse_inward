from flask import Blueprint, jsonify, request
from database.db import get_db_connection

invoice_bp = Blueprint('invoice', __name__)

@invoice_bp.route('/invoices', methods=['GET'])
def get_invoices():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM invoices;')
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

@invoice_bp.route('/invoices', methods=['POST'])
def add_invoice():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO invoices (grn_id, invoice_date, total_amount, status) VALUES (%s, %s, %s, %s)',
                (data['grn_id'], data['invoice_date'], data['total_amount'], data['status']))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Invoice added successfully'})

@invoice_bp.route('/invoices/<int:pi_id>/status', methods=['PUT'])
def update_invoice_status(pi_id):
    data = request.get_json()
    status = data.get('status')

    if status not in ['Approved', 'Rejected', 'Pending']:
        return jsonify({'error': 'Invalid status'}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE invoices SET status=%s WHERE pi_id=%s', (status, pi_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': f'Invoice {pi_id} updated to {status}'})

@invoice_bp.route('/invoices/pending', methods=['GET'])
def pending_invoices():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM invoices WHERE status='Pending'")
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)
