import axios from 'axios';
import React from 'react';

class InventoryForm extends React.Component {
  state = {
    productName: '',
    purchaseDate: '',
    productCategory: '',
    purchaseQuantity: '',
    preferredBarcode: '',
    restockDate: '',
    restockQuantity: ''
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validateDates = () => {
    const { purchaseDate, restockDate } = this.state;
    const today = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);

    const purchase = new Date(purchaseDate);
    const restock = new Date(restockDate);

    if (purchase < twoDaysAgo || purchase > today) {
      alert("Purchase date should be today or within the last two days.");
      return false;
    }

    if (restock <= purchase || (restock - purchase) / (1000 * 60 * 60 * 24) < 2) {
      alert("Restock date should be at least two days after the purchase date.");
      return false;
    }

    return true;
  };


  handleSubmit = async (e) => {
    e.preventDefault();
    if(!this.validateDates()) return;
    await axios.post('http://localhost:5000/api/inventory/add', this.state);
    this.setState({
      productName: '',
      purchaseDate: '',
      productCategory: '',
      purchaseQuantity: '',
      preferredBarcode: '',
      restockDate: '',
      restockQuantity: ''
    });
    window.location.reload(); // Refresh to update list
  };

  render() {
    return (
      <div className="card p-4 mb-4">
        <h2>Add Inventory Item</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              <input
                type="text"
                name="productName"
                value={this.state.productName}
                onChange={this.handleChange}
                className="form-control mb-2"
                placeholder="Product Name"
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="date"
                name="purchaseDate"
                value={this.state.purchaseDate}
                onChange={this.handleChange}
                className="form-control mb-2"
                required
              />
            </div>
            <div className="col-md-4">
              <select
                name="productCategory"
                value={this.state.productCategory}
                onChange={this.handleChange}
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
          </div>
          <div className="row">
            <div className="col-md-4">
              <input
                type="number"
                name="purchaseQuantity"
                value={this.state.purchaseQuantity}
                onChange={this.handleChange}
                className="form-control mb-2"
                placeholder="Purchase Quantity"
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                name="preferredBarcode"
                value={this.state.preferredBarcode}
                onChange={this.handleChange}
                className="form-control mb-2"
                placeholder="Preferred Barcode"
              />
            </div>
            <div className="col-md-4">
              <input
                type="date"
                name="restockDate"
                value={this.state.restockDate}
                onChange={this.handleChange}
                className="form-control mb-2"
                placeholder="Restock Date"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <input
                type="number"
                name="restockQuantity"
                value={this.state.restockQuantity}
                onChange={this.handleChange}
                className="form-control mb-2"
                placeholder="Restock Quantity"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Item</button>
        </form>
      </div>
    );
  }
}

export default InventoryForm;