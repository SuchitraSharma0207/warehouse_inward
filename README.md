## Warehouse Inward System

This is a mini full-stack application that helps manage the inward flow of goods in a warehouse.<br>
It covers the entire process from ordering items from vendors to receiving them and generating invoices for payment.

## Features

### Masters

Product Master: Manage all products with details like code, name, category, HSN code, and status.<br>
Vendor Master: Manage all vendors with details like code, name, contact info, GST, and status.

### Purchase Orders (PO)

Create purchase orders for vendors with product details and quantities.<br>
View all POs with their current status (Pending, Partially Received, Completed).
Cancel POs if needed.

### Goods Receipt Note (GRN)

Generate GRN when goods arrive.<br>
Validate received quantities (cannot exceed PO quantities).<br>
Ensure pricing is within limits (e.g., MRP not more than 20% higher than last purchase).

### Purchase Invoice (PI)

Create invoices based on GRNs received.<br>
Approve or reject invoices.<br>
Track pending payments.

### Dashboard

View summary cards (total products, vendors, pending POs, pending invoices).

## How It Works

Create a Purchase Order (PO) when you want to buy items.<br>
Receive Goods and Generate GRN when the vendor delivers them.<br>
Create a Purchase Invoice (PI) after confirming receipt to process payment.<br>
Monitor Everything on the Dashboard for quick updates.

## Technology Used
Frontend: React.js <br>
Backend: Python Flask <br>
Database: PostgreSQL 
