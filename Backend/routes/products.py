from flask import Blueprint, jsonify, request
from database.db import get_db_connection

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM products;')
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

@products_bp.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO products (product_code, product_name, category, hsn_code, status) VALUES (%s, %s, %s, %s, %s)',
                (data['product_code'], data['product_name'], data['category'], data['hsn_code'], data['status']))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Product added successfully'})

@products_bp.route('/products/search', methods=['GET'])
def search_products():
    name = request.args.get('name', '')
    category = request.args.get('category', '')
    status = request.args.get('status', '')
    
    conn = get_db_connection()
    cur = conn.cursor()
    query = "SELECT * FROM products WHERE product_name ILIKE %s AND category ILIKE %s AND status ILIKE %s"
    cur.execute(query, (f'%{name}%', f'%{category}%', f'%{status}%'))
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

