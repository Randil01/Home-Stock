import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const AssetChart = ({ assets }) => {
  const chartData = assets.map((asset) => ({
    name: asset.name,
    value: asset.value,
  }));

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Depreciation Trends</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetChart;
