import axios from 'axios';
import { jsPDF } from 'jspdf';
import React from 'react';
import Navbar from '../navbar/navbar';
import './InvList.css';

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
        report: [],
        bill: [],
        searchQuery: "",
        errors: {} // For validation errors
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

    // Validation Logic
    validateForm = (item, isUpdate = false) => {
        const errors = {};
        const today = new Date().toISOString().split('T')[0];

        // Product Name: Required, 1-100 chars, alphanumeric with spaces/punctuation
        if (!item.productName || item.productName.trim() === '') {
            errors.productName = 'Product name is required';
        } else if (!/^[a-zA-Z0-9\s,.-]{1,100}$/.test(item.productName)) {
            errors.productName = 'Product name must be 1-100 characters (letters, numbers, spaces, commas, periods, hyphens)';
        }

        // Purchase Date: Required, valid date, not in future
        if (!item.purchaseDate) {
            errors.purchaseDate = 'Purchase date is required';
        } else if (item.purchaseDate > today) {
            errors.purchaseDate = 'Purchase date cannot be in the future';
        }

        // Product Category: Required, must be valid option
        const validCategories = [
            'Fresh product', 'Dairy and eggs', 'Meat and seafood',
            'Dry goods staples', 'Household and personal care', 'Other'
        ];
        if (!isUpdate && (!item.productCategory || !validCategories.includes(item.productCategory))) {
            errors.productCategory = 'Please select a valid category';
        } else if (isUpdate && !validCategories.includes(item.productCategory)) {
            errors.productCategory = 'Please select a valid category';
        }

        // Purchase Quantity: Required, positive integer
        if (!item.purchaseQuantity) {
            errors.purchaseQuantity = 'Purchase quantity is required';
        } else if (!/^[1-9]\d*$/.test(item.purchaseQuantity)) {
            errors.purchaseQuantity = 'Purchase quantity must be a positive integer';
        }

        // Preferred Barcode: Optional, exactly 20 digits if provided
        if (item.preferredBarcode && !/^\d{20}$/.test(item.preferredBarcode)) {
            errors.preferredBarcode = 'Barcode must be exactly 20 digits';
        }

        // Restock Date: Optional, valid date, not before purchase date
        if (item.restockDate && item.restockDate < item.purchaseDate) {
            errors.restockDate = 'Restock date cannot be before purchase date';
        }

        // Restock Quantity: Optional, non-negative integer
        if (item.restockQuantity && !/^\d+$/.test(item.restockQuantity)) {
            errors.restockQuantity = 'Restock quantity must be a non-negative integer';
        }

        return errors;
    };

    // Update Modal Functions
    openUpdateModal = (item) => {
        this.setState({ showUpdateModal: true, selectedItem: item, errors: {} });
    };

    closeUpdateModal = () => {
        this.setState({ showUpdateModal: false, selectedItem: null, errors: {} });
    };

    updateItem = async (e) => {
        e.preventDefault();
        const { selectedItem } = this.state;
        const errors = this.validateForm(selectedItem, true);
        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }
        await axios.put(`http://localhost:5000/api/inventory/${selectedItem._id}`, selectedItem);
        this.fetchItems();
        this.closeUpdateModal();
    };

    handleUpdateChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            selectedItem: { ...prevState.selectedItem, [name]: value },
            errors: { ...prevState.errors, [name]: '' } // Clear error on change
        }));
    };

    // Add Modal Functions
    openAddModal = () => {
        this.setState({ showAddModal: true, errors: {} });
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
            },
            errors: {}
        });
    };

    handleAddChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            newItem: { ...prevState.newItem, [name]: value },
            errors: { ...prevState.errors, [name]: '' } // Clear error on change
        }));
    };

    handleAddSubmit = async (e) => {
        e.preventDefault();
        const { newItem } = this.state;
        const errors = this.validateForm(newItem);
        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }
        await axios.post('http://localhost:5000/api/inventory/add', newItem);
        this.fetchItems();
        this.closeAddModal();
    };

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
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

        doc.setTextColor(34, 177, 76);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("HomeStock", 105, 15, { align: "center" });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.text("Purchase Report", 105, 25, { align: "center" });

        doc.setLineWidth(0.7);
        doc.line(10, 30, 200, 30);

        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Date: ${currentDate}`, 10, 40);

        let y = 50;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Product Name", 10, y);
        doc.text("Purchase Date", 80, y);
        doc.text("Category", 150, y);
        y += 10;

        doc.setFont("helvetica", "normal");
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

        doc.setTextColor(34, 177, 76);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("HomeStock", 105, 15, { align: "center" });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.text("Grocery Bill", 105, 25, { align: "center" });

        doc.setLineWidth(0.7);
        doc.line(10, 30, 200, 30);

        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Date: ${currentDate}`, 10, 40);

        let y = 50;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Product Name", 10, y);
        doc.text("Purchase Date", 60, y);
        doc.text("Quantity", 110, y);
        doc.text("Category", 140, y);
        y += 10;

        doc.setFont("helvetica", "normal");
        bill.forEach((item) => {
            doc.text(item.productName, 10, y);
            doc.text(new Date(item.purchaseDate).toLocaleDateString(), 60, y);
            doc.text(String(item.purchaseQuantity), 110, y);
            doc.text(item.productCategory, 140, y);
            y += 10;
        });

        doc.save("grocery_bill.pdf");
    };

    getFilteredItems = () => {
        const { items, searchQuery } = this.state;
        return items.filter(item =>
            item.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    render() {
        const { showUpdateModal, selectedItem, showAddModal, newItem, report, bill, searchQuery, errors } = this.state;
        const filteredItems = this.getFilteredItems();

        return (
            <div>
                <Navbar />
                <div className="mt-4 mainInvLayout">
                    <h2>Inventory List</h2>
                    <button className="mb-3 mr-2 btn btn-primary" onClick={this.openAddModal}>
                        Add Item
                    </button>
                    <button className="mb-3 mr-10 btn btn-info" onClick={this.generateReport}>
                        Generate Purchase Report
                    </button>
                    <button className="mb-3 btn btn-success" onClick={this.generateBill}>
                        Generate Grocery Bill
                    </button>
                    <input
                        type="text"
                        className="mb-3 form-control"
                        placeholder="Search items by name..."
                        value={searchQuery}
                        onChange={this.handleSearchChange}
                    />
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Purchase Date</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Barcode</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No items found matching your search</td>
                                </tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.productName}</td>
                                        <td>{new Date(item.purchaseDate).toLocaleDateString()}</td>
                                        <td>{item.productCategory}</td>
                                        <td>{item.purchaseQuantity}</td>
                                        <td>{item.preferredBarcode}</td>
                                        <td>
                                            <button
                                                className="mr-10 btn btn-warning btn-sm"
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
                                ))
                            )}
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
                                                    <label htmlFor="productName" className="form-label">Product Name</label>
                                                    <input
                                                        type="text"
                                                        id="productName"
                                                        name="productName"
                                                        value={newItem.productName}
                                                        onChange={this.handleAddChange}
                                                        className="mb-2 form-control"
                                                        placeholder="Enter product name (e.g., Apples)"
                                                        required
                                                    />
                                                    {errors.productName && <div className="error-message">{errors.productName}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="purchaseDate" className="form-label">Purchase Date</label>
                                                    <input
                                                        type="date"
                                                        id="purchaseDate"
                                                        name="purchaseDate"
                                                        value={newItem.purchaseDate}
                                                        onChange={this.handleAddChange}
                                                        className="mb-2 form-control"
                                                        placeholder="Select purchase date"
                                                        required
                                                    />
                                                    {errors.purchaseDate && <div className="error-message">{errors.purchaseDate}</div>}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label htmlFor="productCategory" className="form-label">Product Category</label>
                                                    <select
                                                        id="productCategory"
                                                        name="productCategory"
                                                        value={newItem.productCategory}
                                                        onChange={this.handleAddChange}
                                                        className="mb-2 form-control"
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
                                                    {errors.productCategory && <div className="error-message">{errors.productCategory}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="purchaseQuantity" className="form-label">Purchase Quantity</label>
                                                    <input
                                                        type="number"
                                                        id="purchase頓Quantity"
                                                        name="purchaseQuantity"
                                                        value={newItem.purchaseQuantity}
                                                        onChange={this.handleAddChange}
                                                        className="mb-2 form-control"
                                                        placeholder="Enter quantity (e.g., 5)"
                                                        required
                                                    />
                                                    {errors.purchaseQuantity && <div className="error-message">{errors.purchaseQuantity}</div>}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label htmlFor="preferredBarcode" className="form-label">Preferred Barcode</label>
                                                    <input
                                                        type="text"
                                                        id="preferredBarcode"
                                                        name="preferredBarcode"
                                                        value={newItem.preferredBarcode}
                                                        onChange={this.handleAddChange}
                                                        className="mb-2 form-control"
                                                        placeholder="Enter 20-digit barcode"
                                                    />
                                                    {errors.preferredBarcode && <div className="error-message">{errors.preferredBarcode}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="restockDate" className="form-label">Restock Date</label>
                                                    <input
                                                        type="date"
                                                        id="restockDate"
                                                        name="restockDate"
                                                        value={newItem.restockDate}
                                                        onChange={this.handleAddChange}
                                                        className="mb-2 form-control"
                                                        placeholder="Select restock date (optional)"
                                                    />
                                                    {errors.restockDate && <div className="error-message">{errors.restockDate}</div>}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label htmlFor="restockQuantity" className="form-label">Restock Quantity</label>
                                                    <input
                                                        type="number"
                                                        id="restockQuantity"
                                                        name="restockQuantity"
                                                        value={newItem.restockQuantity}
                                                        onChange={this.handleAddChange}
                                                        className="mb-2 form-control"
                                                        placeholder="Enter restock quantity (optional)"
                                                    />
                                                    {errors.restockQuantity && <div className="error-message">{errors.restockQuantity}</div>}
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
                                            <label htmlFor="updateProductName" className="form-label">Product Name</label>
                                            <input
                                                type="text"
                                                id="updateProductName"
                                                name="productName"
                                                value={selectedItem.productName}
                                                onChange={this.handleUpdateChange}
                                                className="mb-2 form-control"
                                                placeholder="Enter product name (e.g., Apples)"
                                            />
                                            {errors.productName && <div className="error-message">{errors.productName}</div>}
                                            <label htmlFor="updatePurchaseDate" className="form-label">Purchase Date</label>
                                            <input
                                                type="date"
                                                id="updatePurchaseDate"
                                                name="purchaseDate"
                                                value={selectedItem.purchaseDate.split('T')[0]}
                                                onChange={this.handleUpdateChange}
                                                className="mb-2 form-control"
                                                placeholder="Select purchase date"
                                            />
                                            {errors.purchaseDate && <div className="error-message">{errors.purchaseDate}</div>}
                                            <label htmlFor="updateProductCategory" className="form-label">Product Category</label>
                                            <select
                                                id="updateProductCategory"
                                                name="productCategory"
                                                value={selectedItem.productCategory}
                                                onChange={this.handleUpdateChange}
                                                className="mb-2 form-control"
                                            >
                                                <option value="Fresh product">Fresh product</option>
                                                <option value="Dairy and eggs">Dairy and eggs</option>
                                                <option value="Meat and seafood">Meat and seafood</option>
                                                <option value="Dry goods staples">Dry goods staples</option>
                                                <option value="Household and personal care">Household and personal care</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.productCategory && <div className="error-message">{errors.productCategory}</div>}
                                            <label htmlFor="updatePurchaseQuantity" className="form-label">Purchase Quantity</label>
                                            <input
                                                type="number"
                                                id="updatePurchaseQuantity"
                                                name="purchaseQuantity"
                                                value={selectedItem.purchaseQuantity}
                                                onChange={this.handleUpdateChange}
                                                className="mb-2 form-control"
                                                placeholder="Enter quantity (e.g., 5)"
                                            />
                                            {errors.purchaseQuantity && <div className="error-message">{errors.purchaseQuantity}</div>}
                                            <label htmlFor="updatePreferredBarcode" className="form-label">Preferred Barcode</label>
                                            <input
                                                type="text"
                                                id="updatePreferredBarcode"
                                                name="preferredBarcode"
                                                value={selectedItem.preferredBarcode || ''}
                                                onChange={this.handleUpdateChange}
                                                className="mb-2 form-control"
                                                placeholder="Enter 20-digit barcode"
                                            />
                                            {errors.preferredBarcode && <div className="error-message">{errors.preferredBarcode}</div>}
                                            <label htmlFor="updateRestockDate" className="form-label">Restock Date</label>
                                            <input
                                                type="date"
                                                id="updateRestockDate"
                                                name="restockDate"
                                                value={selectedItem.restockDate ? selectedItem.restockDate.split('T')[0] : ''}
                                                onChange={this.handleUpdateChange}
                                                className="mb-2 form-control"
                                                placeholder="Select restock date (optional)"
                                            />
                                            {errors.restockDate && <div className="error-message">{errors.restockDate}</div>}
                                            <label htmlFor="updateRestockQuantity" className="form-label">Restock Quantity</label>
                                            <input
                                                type="number"
                                                id="updateRestockQuantity"
                                                name="restockQuantity"
                                                value={selectedItem.restockQuantity || ''}
                                                onChange={this.handleUpdateChange}
                                                className="mb-2 form-control"
                                                placeholder="Enter restock quantity (optional)"
                                            />
                                            {errors.restockQuantity && <div className="error-message">{errors.restockQuantity}</div>}
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
                            <button className="mb-2 btn btn-primary" onClick={this.downloadPurchaseReportPDF}>
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
                            <button className="mb-2 btn btn-primary" onClick={this.downloadBillPDF}>
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
                                            <td>{new Date(item.purchaseDate).toLocaleDateString()}</td>
                                            <td>{item.purchaseQuantity}</td>
                                            <td>{item.productCategory}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default InventoryList;