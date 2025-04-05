import React, { useState } from "react";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";

const AssetList = ({ assets, setAssets }) => {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", category: "", value: "", purchase_date: "" });

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/assets/${id}`);
    setAssets(assets.filter((asset) => asset._id !== id));
  };

  const handleEdit = (asset) => {
    setEditId(asset._id);
    setEditData({
      name: asset.name,
      category: asset.category,
      value: asset.value,
      purchase_date: asset.purchase_date.split("T")[0], // Format for input type="date"
    });
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/assets/${id}`, editData);
    setAssets(assets.map((asset) => (asset._id === id ? { ...asset, ...editData } : asset)));
    setEditId(null);
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Value (LKR)</th>
          <th>Purchase Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <tr key={asset._id}>
            <td>
              {editId === asset._id ? (
                <Form.Control
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              ) : (
                asset.name
              )}
            </td>
            <td>
              {editId === asset._id ? (
                <Form.Control
                  type="text"
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                />
              ) : (
                asset.category
              )}
            </td>
            <td>
              {editId === asset._id ? (
                <Form.Control
                  type="number"
                  value={editData.value}
                  onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                />
              ) : (
                `$${asset.value}`
              )}
            </td>
            <td>
              {editId === asset._id ? (
                <Form.Control
                  type="date"
                  value={editData.purchase_date}
                  onChange={(e) => setEditData({ ...editData, purchase_date: e.target.value })}
                />
              ) : (
                new Date(asset.purchase_date).toLocaleDateString()
              )}
            </td>
            <td>
              {editId === asset._id ? (
                <Button variant="primary" onClick={() => handleUpdate(asset._id)}>
                  Save
                </Button>
              ) : (
                <>
                  <Button variant="warning" onClick={() => handleEdit(asset)} className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(asset._id)}>
                    Delete
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AssetList;
