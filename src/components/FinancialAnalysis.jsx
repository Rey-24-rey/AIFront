import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  PointElement, 
  Filler 
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler
);

const FinancialAnalysis = () => {
  // State for analysis data, loading, and error
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for COGS search inputs/results
  const [searchProduct, setSearchProduct] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // === LIVE DATA FETCHING ===
  useEffect(() => {
    fetch("https://aimodel-yq14.onrender.com/analysis-data") // Adjust endpoint as needed
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch analysis data");
        }
        return res.json();
      })
      .then((data) => {
        setAnalysisData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data: " + err.message);
        setLoading(false);
      });
  }, []);
  // === END LIVE FETCHING ===

  if (loading) return <p>Loading analysis data...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!analysisData) return <p>No analysis data available.</p>;

  // Destructure analysisData with defaults
  const { 
    productSales, profitLoss, growthAnalysis, 
    lowSalesProducts, cogsAnalysis, totalSales, 
    prediction, dailyDetails 
  } = analysisData;

  // Helper function to render tables
  const renderTable = (tableData, title) => (
    <div className="table-container">
      <h3 className="table-title">{title}</h3>
      <table className="data-table">
        <thead>
          <tr>
            {tableData.headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Chart Data Definitions
  const productSalesChartData = {
    labels: productSales.rows.map(row => row[0]),
    datasets: [{
      label: "Sales Volume",
      data: productSales.rows.map(row => row[1]),
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)"
    }]
  };

  const growthChartData = {
    labels: ["Daily", "Weekly", "Monthly", "Yearly"],
    datasets: [{
      label: "Sales Growth (%)",
      data: [
        growthAnalysis.daily_growth[0] * 100,
        growthAnalysis.weekly_growth[0] * 100,
        growthAnalysis.monthly_growth[0] * 100,
        growthAnalysis.yearly_growth[0] * 100
      ],
      borderColor: "rgba(153,102,255,1)",
      backgroundColor: "rgba(153,102,255,0.2)",
      fill: true
    }]
  };

  const predictionChartData = {
    labels: ["Daily", "Weekly", "Monthly", "Yearly"],
    datasets: [{
      label: "Predicted Sales (Ksh)",
      data: [prediction.daily, prediction.weekly, prediction.monthly, prediction.yearly],
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    }]
  };

  // COGS Search Section
  const handleSearch = () => {
    setSearchResult(null);
    if (!searchProduct || !searchDate) {
      setSearchResult("Please enter both product name and date.");
      return;
    }
    const productLower = searchProduct.trim().toLowerCase();
    const results = dailyDetails.filter(row => row[1].toLowerCase() === productLower && row[0] === searchDate);
    setSearchResult(results.length ? results.map(row => [...row, row[4] >= 0 ? "Profit" : "Loss"]) : "No COGS data found.");
  };

  return (
    <div className="container">
      <h2>Financial Analysis Results</h2>

      <div className="total-sales">
        <h3>Total Sales:</h3>
        <p className="total-sales-amount">Ksh {totalSales.toFixed(2)}</p>
      </div>

      {/* Render Tables */}
      {renderTable(profitLoss, "Profit and Loss Summary")}
      {renderTable(productSales, "Product Sales Data")}

      {/* Render Charts */}
      <div className="chart-section">
        <h3>Product Sales Chart</h3>
        <Bar data={productSalesChartData} />
      </div>
      <div className="chart-section">
        <h3>Sales Growth Analysis</h3>
        <Line data={growthChartData} />
      </div>
      <div className="chart-section">
        <h3>Predicted Sales</h3>
        <Bar data={predictionChartData} />
      </div>

      {/* COGS Search Section */}
      <div className="search-section">
        <h3>Search Daily COGS, Sales, Profit & Losses</h3>
        <div>
          <input type="text" placeholder="Enter Product Name" value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} />
          <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
          <button onClick={handleSearch}>Search</button>
        </div>
        {searchResult && (
          <div className="search-result">
            {Array.isArray(searchResult) ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Sales</th>
                    <th>COGS</th>
                    <th>Profit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResult.map((row, idx) => (
                    <tr key={idx}>
                      {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>{searchResult}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialAnalysis;
