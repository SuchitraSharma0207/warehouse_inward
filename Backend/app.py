from flask import Flask
from flask_cors import CORS
from routes.products import products_bp
from routes.vendors import vendors_bp
from routes.po import po_bp
from routes.grn import grn_bp
from routes.invoice import invoice_bp
from routes.dashboard import dashboard_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(products_bp)
app.register_blueprint(vendors_bp)
app.register_blueprint(po_bp)
app.register_blueprint(grn_bp)
app.register_blueprint(invoice_bp)
app.register_blueprint(dashboard_bp)

if __name__ == '__main__':
    app.run(debug=True)
