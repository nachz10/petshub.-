import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SalesOverTimeData } from "../../api/analytics";

interface SalesChartProps {
  data: SalesOverTimeData[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No sales data available to display.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
