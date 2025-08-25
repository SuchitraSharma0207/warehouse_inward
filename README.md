## Warehouse Inward System

This is a mini full-stack application that helps manage the inward flow of goods in a warehouse.
It covers the entire process from ordering items from vendors to receiving them and generating invoices for payment.

## Features

### Masters

Product Master: Manage all products with details like code, name, category, HSN code, and status.
Vendor Master: Manage all vendors with details like code, name, contact info, GST, and status.

### Purchase Orders (PO)

Create purchase orders for vendors with product details and quantities.
View all POs with their current status (Pending, Partially Received, Completed).
Cancel POs if needed.

### Goods Receipt Note (GRN)

Generate GRN when goods arrive.
Validate received quantities (cannot exceed PO quantities).
Ensure pricing is within limits (e.g., MRP not more than 20% higher than last purchase).

### Purchase Invoice (PI)

Create invoices based on GRNs received.
Approve or reject invoices.
Track pending payments.

### Dashboard

View summary cards (total products, vendors, pending POs, pending invoices).

## How It Works

Create a Purchase Order (PO) when you want to buy items.
Receive Goods and Generate GRN when the vendor delivers them.
Create a Purchase Invoice (PI) after confirming receipt to process payment.
Monitor Everything on the Dashboard for quick updates.

## Technology Used
Frontend: React.js 
Backend: Python Flask 
Database: PostgreSQL 
