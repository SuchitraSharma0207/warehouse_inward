from flask import Blueprint, jsonify, request
from database.db import get_db_connection

vendors_bp = Blueprint('vendors', __name__)

@vendors_bp.route('/vendors', methods=['GET'])
def get_vendors():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM vendors;')
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

@vendors_bp.route('/vendors', methods=['POST'])
def add_vendor():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO vendors (vendor_code, vendor_name, contact_person, contact_number, gst_number, address, status) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                (data['vendor_code'], data['vendor_name'], data['contact_person'], data['contact_number'], data['gst_number'], data['address'], data['status']))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Vendor added successfully'})

@vendors_bp.route('/vendors/search', methods=['GET'])
def search_vendors():
    name = request.args.get('name', '')
    code = request.args.get('code', '')
    status = request.args.get('status', '')
    
    conn = get_db_connection()
    cur = conn.cursor()
    query = "SELECT * FROM vendors WHERE vendor_name ILIKE %s AND vendor_code ILIKE %s AND status ILIKE %s"
    cur.execute(query, (f'%{name}%', f'%{code}%', f'%{status}%'))
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)
