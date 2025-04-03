import axios from 'axios';
import { jsPDF } from 'jspdf';
import React from 'react';

class Report extends React.Component {
  state = { report: [], bill: [] };

  // Fetch purchase report
  generateReport = async () => {
    const res = await axios.get('http://localhost:5000/api/inventory/report');
    this.setState({ report: res.data, bill: [] });
  };

  // Fetch grocery bill
  generateBill = async () => {
    const res = await axios.get('http://localhost:5000/api/inventory/bill');
    this.setState({ bill: res.data, report: [] });
  };

  // Download purchase report as PDF
  downloadPurchaseReportPDF = () => {
    const { report } = this.state;
    const doc = new jsPDF();

    doc.text('Purchase Report', 10, 10);
    let y = 20; // Starting y-position for content

    doc.setFontSize(12);
    doc.text('Product Name            Purchase Date            Category', 10, y);
    y += 10;

    report.forEach((item) => {
      const purchaseDate = new Date(item.purchaseDate).toLocaleDateString();
      doc.text(`${item.productName.padEnd(20)} ${purchaseDate.padEnd(20)} ${item.productCategory}`, 10, y);
      y += 10;
    });

    doc.save('purchase_report.pdf');
  };

  // Download grocery bill as PDF
  downloadBillPDF = () => {
    const { bill } = this.state;
    const doc = new jsPDF();

    doc.text('Grocery Bill', 10, 10);
    let y = 20; // Starting y-position for content

    doc.setFontSize(12);
    doc.text('Product Name            Purchase Date            Quantity            Category', 10, y);
    y += 10;

    bill.forEach((item) => {
      doc.text(
        `${item.productName.padEnd(20)} ${item.purchaseDate.padEnd(20)} ${String(item.purchaseQuantity).padEnd(15)} ${item.productCategory}`,
        10,
        y
      );
      y += 10;
    });

    doc.save('grocery_bill.pdf');
  };

  render() {
    const { report, bill } = this.state;

    return (
      <div className="mt-4">
        <h2>Reports</h2>
        <button className="btn btn-info mr-2" onClick={this.generateReport}>
          Generate Purchase Report
        </button>
        <button className="btn btn-success mr-2" onClick={this.generateBill}>
          Generate Grocery Bill
        </button>

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

export default Report;