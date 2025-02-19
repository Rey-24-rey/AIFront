import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// ✅ Register missing components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analysis = ({ analysisData }) => {
  if (!analysisData) {
    return <p>No analysis data available.</p>;
  }

  const productMetrics = analysisData.productMetrics || [];

  const productChartData = {
    labels: productMetrics.map((metric) => metric.productName),
    datasets: [
      {
        label: "Sales",
        data: productMetrics.map((metric) => metric.totalSales),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
      {
        label: "COGS",
        data: productMetrics.map((metric) => metric.productCOGS),
        backgroundColor: "rgba(255,159,64,0.2)",
        borderColor: "rgba(255,159,64,1)",
        borderWidth: 1,
      },
      {
        label: "Profit",
        data: productMetrics.map((metric) => metric.profit),
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-6">
      <h2 className="text-2xl font-semibold text-green-300 mb-4">Analysis Results</h2>

      <div className="chart-container">
        <h3 className="chart-title">Product Metrics: Sales, COGS, and Profit</h3>
        <Bar data={productChartData} />
      </div>
    </div>
  );
};

export default Analysis;
