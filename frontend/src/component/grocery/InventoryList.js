import axios from "axios";
import { jsPDF } from "jspdf";
import React from "react";
import Navbar from "../navbar/navbar";
import "./InvList.css";

class InventoryList extends React.Component {
  state = {
    items: [],
    showUpdateModal: false,
    selectedItem: null,
    showAddModal: false,
    newItem: {
      productName: "",
      purchaseDate: "",
      productCategory: "",
      purchaseQuantity: "",
      preferredBarcode: "",
      restockDate: "",
      restockQuantity: "",
    },
    report: [],
    bill: [],
    searchQuery: "",
    errors: {}, // For validation errors
  };

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = async () => {
    const res = await axios.get("http://localhost:5000/api/inventory");
    this.setState({ items: res.data });
  };

  deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/api/inventory/${id}`);
    this.fetchItems();
  };

  validateForm = (item, isUpdate = false) => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    if (!item.productName || item.productName.trim() === "") {
      errors.productName = "Product name is required";
    } else if (!/^[a-zA-Z0-9\s,.-]{1,100}$/.test(item.productName)) {
      errors.productName =
        "Product name must be 1-100 characters (letters, numbers, spaces, commas, periods, hyphens)";
    }

    if (!item.purchaseDate) {
      errors.purchaseDate = "Purchase date is required";
    } else {
      const purchase = parseDate(item.purchaseDate);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(today.getDate() - 2);
      twoDaysAgo.setHours(0, 0, 0, 0);

      if (purchase < twoDaysAgo || purchase > today) {
        errors.purchaseDate =
          "Purchase date must be today or within the last 2 days";
      }
    }

    const validCategories = [
      "Fresh product",
      "Dairy and eggs",
      "Meat and seafood",
      "Dry goods staples",
      "Household and personal care",
      "Other",
    ];
    if (
      !isUpdate &&
      (!item.productCategory || !validCategories.includes(item.productCategory))
    ) {
      errors.productCategory = "Please select a valid category";
    } else if (isUpdate && !validCategories.includes(item.productCategory)) {
      errors.productCategory = "Please select a valid category";
    }

    if (!item.purchaseQuantity) {
      errors.purchaseQuantity = "Purchase quantity is required";
    } else if (!/^[1-9]\d*$/.test(item.purchaseQuantity)) {
      errors.purchaseQuantity = "Purchase quantity must be a positive integer";
    }

    if (item.preferredBarcode && !/^\d{10}$/.test(item.preferredBarcode)) {
      errors.preferredBarcode = "Barcode must be exactly 10 digits";
    }

    if (item.restockDate) {
      const purchase = parseDate(item.purchaseDate);
      const restock = parseDate(item.restockDate);

      const diffInDays = (restock - purchase) / (1000 * 60 * 60 * 24);

      if (restock < purchase) {
        errors.restockDate = "Restock date cannot be before purchase date";
      } else if (diffInDays < 2) {
        errors.restockDate =
          "Restock date must be at least 2 days after purchase date";
      }
    }

    if (item.restockQuantity && !/^\d+$/.test(item.restockQuantity)) {
      errors.restockQuantity =
        "Restock quantity must be a non-negative integer";
    }

    return errors;
  };

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
    await axios.put(
      `http://localhost:5000/api/inventory/${selectedItem._id}`,
      selectedItem
    );
    this.fetchItems();
    this.closeUpdateModal();
  };

  handleUpdateChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      selectedItem: { ...prevState.selectedItem, [name]: value },
      errors: { ...prevState.errors, [name]: "" },
    }));
  };

  openAddModal = () => {
    this.setState({ showAddModal: true, errors: {} });
  };

  closeAddModal = () => {
    this.setState({
      showAddModal: false,
      newItem: {
        productName: "",
        purchaseDate: "",
        productCategory: "",
        purchaseQuantity: "",
        preferredBarcode: "",
        restockDate: "",
        restockQuantity: "",
      },
      errors: {},
    });
  };

  handleAddChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newItem: { ...prevState.newItem, [name]: value },
      errors: { ...prevState.errors, [name]: "" },
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
    await axios.post("http://localhost:5000/api/inventory/add", newItem);
    this.fetchItems();
    this.closeAddModal();
  };

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  generateReport = async () => {
    const res = await axios.get("http://localhost:5000/api/inventory/report");
    this.setState({ report: res.data, bill: [] });
  };

  generateBill = async () => {
    const res = await axios.get("http://localhost:5000/api/inventory/bill");
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
    return items.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  render() {
    const {
      showUpdateModal,
      selectedItem,
      showAddModal,
      newItem,
      report,
      bill,
      searchQuery,
      errors,
    } = this.state;
    const filteredItems = this.getFilteredItems();

    return (
      <div>
        <Navbar />
        <div className="container mt-4 mainInvLayout">
          <h2 className="mb-4 fw-bold fs-1">Inventory List</h2>
          <div className="d-flex mb-3 gap-2">
            <button className="btn btn-primary" onClick={this.openAddModal}>
              + Add Item
            </button>
            <button className="btn btn-success" onClick={this.generateReport}>
              Purchase Report
            </button>
            <button className="btn btn-success" onClick={this.generateBill}>
              Grocery Bill Report
            </button>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search items by name..."
              value={searchQuery}
              onChange={this.handleSearchChange}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
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
                    <td colSpan="6" className="text-center">
                      No items found matching your search
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item._id}>
                      <td>{item.productName}</td>
                      <td>
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </td>
                      <td>{item.productCategory}</td>
                      <td>{item.purchaseQuantity}</td>
                      <td>{item.preferredBarcode}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm"
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Add Item Modal */}
          {showAddModal && (
            <div
              className="modal show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title text-center text-lg font-bold">
                      Add Inventory Item
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={this.closeAddModal}
                    ></button>
                  </div>
                  <form onSubmit={this.handleAddSubmit}>
                    <div className="modal-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="productName" className="form-label">
                            Product Name
                          </label>
                          <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={newItem.productName}
                            onChange={this.handleAddChange}
                            className={`form-control ${
                              errors.productName ? "is-invalid" : ""
                            }`}
                            placeholder="Enter product name"
                          />
                          {errors.productName && (
                            <div className="invalid-feedback">
                              {errors.productName}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="purchaseDate" className="form-label">
                            Purchase Date
                          </label>
                          <input
                            type="date"
                            id="purchaseDate"
                            name="purchaseDate"
                            value={newItem.purchaseDate}
                            onChange={this.handleAddChange}
                            className={`form-control ${
                              errors.purchaseDate ? "is-invalid" : ""
                            }`}
                          />
                          {errors.purchaseDate && (
                            <div className="invalid-feedback">
                              {errors.purchaseDate}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="productCategory"
                            className="form-label"
                          >
                            Product Category
                          </label>
                          <select
                            id="productCategory"
                            name="productCategory"
                            value={newItem.productCategory}
                            onChange={this.handleAddChange}
                            className={`form-select ${
                              errors.productCategory ? "is-invalid" : ""
                            }`}
                          >
                            <option value="">Select Category</option>
                            <option value="Fresh product">Fresh product</option>
                            <option value="Dairy and eggs">
                              Dairy and eggs
                            </option>
                            <option value="Meat and seafood">
                              Meat and seafood
                            </option>
                            <option value="Dry goods staples">
                              Dry goods staples
                            </option>
                            <option value="Household and personal care">
                              Household and personal care
                            </option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.productCategory && (
                            <div className="invalid-feedback">
                              {errors.productCategory}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="purchaseQuantity"
                            className="form-label"
                          >
                            Purchase Quantity
                          </label>
                          <input
                            type="number"
                            id="purchaseQuantity"
                            name="purchaseQuantity"
                            value={newItem.purchaseQuantity}
                            onChange={this.handleAddChange}
                            className={`form-control ${
                              errors.purchaseQuantity ? "is-invalid" : ""
                            }`}
                            placeholder="Enter quantity"
                          />
                          {errors.purchaseQuantity && (
                            <div className="invalid-feedback">
                              {errors.purchaseQuantity}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="preferredBarcode"
                            className="form-label"
                          >
                            Preferred Barcode
                          </label>
                          <input
                            type="text"
                            id="preferredBarcode"
                            name="preferredBarcode"
                            value={newItem.preferredBarcode}
                            onChange={this.handleAddChange}
                            className={`form-control ${
                              errors.preferredBarcode ? "is-invalid" : ""
                            }`}
                            placeholder="Enter 10-digit barcode"
                          />
                          {errors.preferredBarcode && (
                            <div className="invalid-feedback">
                              {errors.preferredBarcode}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="restockDate" className="form-label">
                            Restock Date
                          </label>
                          <input
                            type="date"
                            id="restockDate"
                            name="restockDate"
                            value={newItem.restockDate}
                            onChange={this.handleAddChange}
                            className={`form-control ${
                              errors.restockDate ? "is-invalid" : ""
                            }`}
                          />
                          {errors.restockDate && (
                            <div className="invalid-feedback">
                              {errors.restockDate}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="restockQuantity"
                            className="form-label"
                          >
                            Restock Quantity
                          </label>
                          <input
                            type="number"
                            id="restockQuantity"
                            name="restockQuantity"
                            value={newItem.restockQuantity}
                            onChange={this.handleAddChange}
                            className={`form-control ${
                              errors.restockQuantity ? "is-invalid" : ""
                            }`}
                            placeholder="Enter restock quantity"
                          />
                          {errors.restockQuantity && (
                            <div className="invalid-feedback">
                              {errors.restockQuantity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.closeAddModal}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Add Item
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Update Item Modal */}
          {showUpdateModal && selectedItem && (
            <div
              className="modal show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Item</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={this.closeUpdateModal}
                    ></button>
                  </div>
                  <form onSubmit={this.updateItem}>
                    <div className="modal-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label
                            htmlFor="updateProductName"
                            className="form-label"
                          >
                            Product Name
                          </label>
                          <input
                            type="text"
                            id="updateProductName"
                            name="productName"
                            value={selectedItem.productName}
                            onChange={this.handleUpdateChange}
                            className={`form-control ${
                              errors.productName ? "is-invalid" : ""
                            }`}
                          />
                          {errors.productName && (
                            <div className="invalid-feedback">
                              {errors.productName}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="updatePurchaseDate"
                            className="form-label"
                          >
                            Purchase Date
                          </label>
                          <input
                            type="date"
                            id="updatePurchaseDate"
                            name="purchaseDate"
                            value={selectedItem.purchaseDate.split("T")[0]}
                            onChange={this.handleUpdateChange}
                            className={`form-control ${
                              errors.purchaseDate ? "is-invalid" : ""
                            }`}
                          />
                          {errors.purchaseDate && (
                            <div className="invalid-feedback">
                              {errors.purchaseDate}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="updateProductCategory"
                            className="form-label"
                          >
                            Product Category
                          </label>
                          <select
                            id="updateProductCategory"
                            name="productCategory"
                            value={selectedItem.productCategory}
                            onChange={this.handleUpdateChange}
                            className={`form-select ${
                              errors.productCategory ? "is-invalid" : ""
                            }`}
                          >
                            <option value="Fresh product">Fresh product</option>
                            <option value="Dairy and eggs">
                              Dairy and eggs
                            </option>
                            <option value="Meat and seafood">
                              Meat and seafood
                            </option>
                            <option value="Dry goods staples">
                              Dry goods staples
                            </option>
                            <option value="Household and personal care">
                              Household and personal care
                            </option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.productCategory && (
                            <div className="invalid-feedback">
                              {errors.productCategory}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="updatePurchaseQuantity"
                            className="form-label"
                          >
                            Purchase Quantity
                          </label>
                          <input
                            type="number"
                            id="updatePurchaseQuantity"
                            name="purchaseQuantity"
                            value={selectedItem.purchaseQuantity}
                            onChange={this.handleUpdateChange}
                            className={`form-control ${
                              errors.purchaseQuantity ? "is-invalid" : ""
                            }`}
                          />
                          {errors.purchaseQuantity && (
                            <div className="invalid-feedback">
                              {errors.purchaseQuantity}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="updatePreferredBarcode"
                            className="form-label"
                          >
                            Preferred Barcode
                          </label>
                          <input
                            type="text"
                            id="updatePreferredBarcode"
                            name="preferredBarcode"
                            value={selectedItem.preferredBarcode || ""}
                            onChange={this.handleUpdateChange}
                            className={`form-control ${
                              errors.preferredBarcode ? "is-invalid" : ""
                            }`}
                          />
                          {errors.preferredBarcode && (
                            <div className="invalid-feedback">
                              {errors.preferredBarcode}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="updateRestockDate"
                            className="form-label"
                          >
                            Restock Date
                          </label>
                          <input
                            type="date"
                            id="updateRestockDate"
                            name="restockDate"
                            value={
                              selectedItem.restockDate
                                ? selectedItem.restockDate.split("T")[0]
                                : ""
                            }
                            onChange={this.handleUpdateChange}
                            className={`form-control ${
                              errors.restockDate ? "is-invalid" : ""
                            }`}
                          />
                          {errors.restockDate && (
                            <div className="invalid-feedback">
                              {errors.restockDate}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="updateRestockQuantity"
                            className="form-label"
                          >
                            Restock Quantity
                          </label>
                          <input
                            type="number"
                            id="updateRestockQuantity"
                            name="restockQuantity"
                            value={selectedItem.restockQuantity || ""}
                            onChange={this.handleUpdateChange}
                            className={`form-control ${
                              errors.restockQuantity ? "is-invalid" : ""
                            }`}
                          />
                          {errors.restockQuantity && (
                            <div className="invalid-feedback">
                              {errors.restockQuantity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.closeUpdateModal}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Purchase Report</h3>
                <button
                  className="btn btn-primary"
                  onClick={this.downloadPurchaseReportPDF}
                >
                  Download as PDF
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
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
                        <td>
                          {new Date(item.purchaseDate).toLocaleDateString()}
                        </td>
                        <td>{item.productCategory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Grocery Bill Section */}
          {bill.length > 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Grocery Bill</h3>
                <button
                  className="btn btn-primary"
                  onClick={this.downloadBillPDF}
                >
                  Download as PDF
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
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
                        <td>
                          {new Date(item.purchaseDate).toLocaleDateString()}
                        </td>
                        <td>{item.purchaseQuantity}</td>
                        <td>{item.productCategory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default InventoryList;
