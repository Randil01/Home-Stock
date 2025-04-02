import axios from 'axios';
import { jsPDF } from 'jspdf';
import React from 'react';

class InventoryList extends React.Component {
    state = {
        items: [],
        showUpdateModal: false,
        selectedItem: null,
        showAddModal: false,
        newItem: {
            productName: '',
            purchaseDate: '',
            productCategory: '',
            purchaseQuantity: '',
            preferredBarcode: '',
            restockDate: '',
            restockQuantity: ''
        },
        report: [], // For purchase report
        bill: []    // For grocery bill
    };

    componentDidMount() {
        this.fetchItems();
    }

    fetchItems = async () => {
        const res = await axios.get('http://localhost:5000/api/inventory');
        this.setState({ items: res.data });
    };

    deleteItem = async (id) => {
        await axios.delete(`http://localhost:5000/api/inventory/${id}`);
        this.fetchItems();
    };

    // Update Modal Functions
    openUpdateModal = (item) => {
        this.setState({ showUpdateModal: true, selectedItem: item });
    };

    closeUpdateModal = () => {
        this.setState({ showUpdateModal: false, selectedItem: null });
    };

    updateItem = async (e) => {
        e.preventDefault();
        const { selectedItem } = this.state;
        await axios.put(`http://localhost:5000/api/inventory/${selectedItem._id}`, selectedItem);
        this.fetchItems();
        this.closeUpdateModal();
    };

    handleUpdateChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            selectedItem: { ...prevState.selectedItem, [name]: value }
        }));
    };

    // Add Modal Functions
    openAddModal = () => {
        this.setState({ showAddModal: true });
    };

    closeAddModal = () => {
        this.setState({
            showAddModal: false,
            newItem: {
                productName: '',
                purchaseDate: '',
                productCategory: '',
                purchaseQuantity: '',
                preferredBarcode: '',
                restockDate: '',
                restockQuantity: ''
            }
        });
    };

    handleAddChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            newItem: { ...prevState.newItem, [name]: value }
        }));
    };

    handleAddSubmit = async (e) => {
        e.preventDefault();
        const { newItem } = this.state;
        await axios.post('http://localhost:5000/api/inventory/add', newItem);
        this.fetchItems();
        this.closeAddModal();
    };

    // Report Generation Functions
    generateReport = async () => {
        const res = await axios.get('http://localhost:5000/api/inventory/report');
        this.setState({ report: res.data, bill: [] });
    };

    generateBill = async () => {
        const res = await axios.get('http://localhost:5000/api/inventory/bill');
        this.setState({ bill: res.data, report: [] });
    };

    downloadPurchaseReportPDF = () => {
        const { report } = this.state;
        const doc = new jsPDF();
    
        // Set "HomeStock" with a light green color
        doc.setTextColor(34, 177, 76); // Light green
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("HomeStock", 105, 15, { align: "center" });
    
        // Reset text color to black for the rest of the content
        doc.setTextColor(0, 0, 0);
    
        // Add "Purchase Report" below HomeStock
        doc.setFontSize(18);
        doc.text("Purchase Report", 105, 25, { align: "center" });
    
        // Underline the title (full page width)
        doc.setLineWidth(0.7);
        doc.line(10, 30, 200, 30); // Underline from left to right of the page
    
        // Add current date with a clear gap below the underline
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Date: ${currentDate}`, 10, 40);
    
        let y = 50; // Start content below the date
    
        // Table Header
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Product Name", 10, y);
        doc.text("Purchase Date", 80, y);
        doc.text("Category", 150, y);
        y += 10;
    
        doc.setFont("helvetica", "normal");
    
        // Table Content
        report.forEach((item) => {
            const purchaseDate = new Date(item.purchaseDate).toLocaleDateString();
            doc.text(item.productName, 10, y);
            doc.text(purchaseDate, 80, y);
            doc.text(item.productCategory, 150, y);
            y += 10;
        });
    
        doc.save("purchase_report.pdf");
    };
    

    downloadBillPDF = () => {
        const { bill } = this.state;
        const doc = new jsPDF();
        
        // Set "HomeStock" with a light green color
        doc.setTextColor(34, 177, 76); // RGB for light green
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("HomeStock", 105, 15, { align: "center" });
    
        // Reset text color to black for the rest of the content
        doc.setTextColor(0, 0, 0);
    
        // Add "Grocery Bill" below HomeStock
        doc.setFontSize(18);
        doc.text("Grocery Bill", 105, 25, { align: "center" });
    
        // Underline the entire headline (full page width)
        doc.setLineWidth(0.7);
        doc.line(10, 30, 200, 30); // Underline from left to right of the page
    
        // Add current date with a clear gap below the underline
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Date: ${currentDate}`, 10, 40);
    
        let y = 50; // Adjusted to provide a clearer gap
    
        // Column titles
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Product Name", 10, y);
        doc.text("Purchase Date", 60, y);
        doc.text("Quantity", 110, y);
        doc.text("Category", 140, y);
        
        y += 10;
    
        // Reset font to normal
        doc.setFont("helvetica", "normal");
    
        // Populate table rows
        bill.forEach((item) => {
            doc.text(item.productName, 10, y);
            doc.text(new Date(item.purchaseDate).toLocaleDateString(), 60, y);
            doc.text(String(item.purchaseQuantity), 110, y);
            doc.text(item.productCategory, 140, y);
            y += 10;
        });
    
        // Save the PDF
        doc.save("grocery_bill.pdf");
    };
    
    
    
    
    render() {
        const { items, showUpdateModal, selectedItem, showAddModal, newItem, report, bill } = this.state;

        return (
            <div className="mt-4">
                <h2>Inventory List</h2>
                <button className="btn btn-primary mb-3 mr-2" onClick={this.openAddModal}>
                    Add Item
                </button>
                <button className="btn btn-info mb-3 mr-10" onClick={this.generateReport}>
                    Generate Purchase Report
                </button>
                <button className="btn btn-success mb-3" onClick={this.generateBill}>
                    Generate Grocery Bill
                </button>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Purchase Date</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td>{item.productName}</td>
                                <td>{new Date(item.purchaseDate).toLocaleDateString()}</td>
                                <td>{item.productCategory}</td>
                                <td>{item.purchaseQuantity}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm mr-2"
                                        onClick={() => this.openUpdateModal(item)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => this.deleteItem(item._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Add Item Modal */}
                {showAddModal && (
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Inventory Item</h5>
                                    <button className="close" onClick={this.closeAddModal}>×</button>
                                </div>
                                <form onSubmit={this.handleAddSubmit}>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="productName"
                                                    value={newItem.productName}
                                                    onChange={this.handleAddChange}
                                                    className="form-control mb-2"
                                                    placeholder="Product Name"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="date"
                                                    name="purchaseDate"
                                                    value={newItem.purchaseDate}
                                                    onChange={this.handleAddChange}
                                                    className="form-control mb-2"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <select
                                                    name="productCategory"
                                                    value={newItem.productCategory}
                                                    onChange={this.handleAddChange}
                                                    className="form-control mb-2"
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="Fresh product">Fresh product</option>
                                                    <option value="Dairy and eggs">Dairy and eggs</option>
                                                    <option value="Meat and seafood">Meat and seafood</option>
                                                    <option value="Dry goods staples">Dry goods staples</option>
                                                    <option value="Household and personal care">Household and personal care</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="number"
                                                    name="purchaseQuantity"
                                                    value={newItem.purchaseQuantity}
                                                    onChange={this.handleAddChange}
                                                    className="form-control mb-2"
                                                    placeholder="Purchase Quantity"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="preferredBarcode"
                                                    value={newItem.preferredBarcode}
                                                    onChange={this.handleAddChange}
                                                    className="form-control mb-2"
                                                    placeholder="Preferred Barcode"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="date"
                                                    name="restockDate"
                                                    value={newItem.restockDate}
                                                    onChange={this.handleAddChange}
                                                    className="form-control mb-2"
                                                    placeholder="Restock Date"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <input
                                                    type="number"
                                                    name="restockQuantity"
                                                    value={newItem.restockQuantity}
                                                    onChange={this.handleAddChange}
                                                    className="form-control mb-2"
                                                    unofficial
                                                    placeholder="Restock Quantity"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">Add Item</button>
                                        <button type="button" className="btn btn-secondary" onClick={this.closeAddModal}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Update Item Modal */}
                {showUpdateModal && selectedItem && (
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Update Item</h5>
                                    <button className="close" onClick={this.closeUpdateModal}>×</button>
                                </div>
                                <form onSubmit={this.updateItem}>
                                    <div className="modal-body">
                                        <input
                                            type="text"
                                            name="productName"
                                            value={selectedItem.productName}
                                            onChange={this.handleUpdateChange}
                                            className="form-control mb-2"
                                            placeholder="Product Name"
                                        />
                                        <input
                                            type="date"
                                            name="purchaseDate"
                                            value={selectedItem.purchaseDate.split('T')[0]}
                                            onChange={this.handleUpdateChange}
                                            className="form-control mb-2"
                                        />
                                        <select
                                            name="productCategory"
                                            value={selectedItem.productCategory}
                                            onChange={this.handleUpdateChange}
                                            className="form-control mb-2"
                                        >
                                            <option value="Fresh product">Fresh product</option>
                                            <option value="Dairy and eggs">Dairy and eggs</option>
                                            <option value="Meat and seafood">Meat and seafood</option>
                                            <option value="Dry goods staples">Dry goods staples</option>
                                            <option value="Household and personal care">Household and personal care</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <input
                                            type="number"
                                            name="purchaseQuantity"
                                            value={selectedItem.purchaseQuantity}
                                            onChange={this.handleUpdateChange}
                                            className="form-control mb-2"
                                            placeholder="Purchase Quantity"
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">Save</button>
                                        <button type="button" className="btn btn-secondary" onClick={this.closeUpdateModal}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Purchase Report Section */}
                {report.length > 0 && (
                    <div className="mt-4">
                        <h3>Purchase Report</h3>
                        <button className="btn btn-primary mb-2" onClick={this.downloadPurchaseReportPDF}>
                            Download as PDF
                        </button>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Purchase Date</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.productName}</td>
                                        <td>{new Date(item.purchaseDate).toLocaleDateString()}</td>
                                        <td>{item.productCategory}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Grocery Bill Section */}
                {bill.length > 0 && (
                    <div className="mt-4">
                        <h3>Grocery Bill</h3>
                        <button className="btn btn-primary mb-2" onClick={this.downloadBillPDF}>
                            Download as PDF
                        </button>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Purchase Date</th>
                                    <th>Quantity</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bill.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.productName}</td>
                                        <td>{item.purchaseDate}</td>
                                        <td>{item.purchaseQuantity}</td>
                                        <td>{item.productCategory}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}

export default InventoryList;