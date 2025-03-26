import axios from 'axios';
import React from 'react';

class InventoryList extends React.Component {
    state = { items: [], showModal: false, selectedItem: null };

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

    openUpdateModal = (item) => {
        this.setState({ showModal: true, selectedItem: item });
    };

    closeModal = () => {
        this.setState({ showModal: false, selectedItem: null });
    };

    updateItem = async (e) => {
        e.preventDefault();
        const { selectedItem } = this.state;
        await axios.put(`http://localhost:5000/api/inventory/${selectedItem._id}`, selectedItem);
        this.fetchItems();
        this.closeModal();
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            selectedItem: { ...prevState.selectedItem, [name]: value }
        }));
    };

    render() {
        const { items, showModal, selectedItem } = this.state;

        return (
            <div className="mt-4">
                <h2>Inventory List</h2>
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

                {showModal && selectedItem && (
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Update Item</h5>
                                    <button className="close" onClick={this.closeModal}>×</button>
                                </div>
                                <form onSubmit={this.updateItem}>
                                    <div className="modal-body">
                                        <input
                                            type="text"
                                            name="productName"
                                            value={selectedItem.productName}
                                            onChange={this.handleChange}
                                            className="form-control mb-2"
                                            placeholder="Product Name"
                                        />
                                        <input
                                            type="date"
                                            name="purchaseDate"
                                            value={selectedItem.purchaseDate.split('T')[0]}
                                            onChange={this.handleChange}
                                            className="form-control mb-2"
                                        />
                                        <select
                                            name="productCategory"
                                            value={selectedItem.productCategory}
                                            onChange={this.handleChange}
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
                                            onChange={this.handleChange}
                                            className="form-control mb-2"
                                            placeholder="Purchase Quantity"
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">Save</button>
                                        <button type="button" className="btn btn-secondary" onClick={this.closeModal}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default InventoryList;