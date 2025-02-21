import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
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
  Filler,
} from "chart.js";
import Footer from "./Footer"; 

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

const AnalysisPage = ({ analysisData: initialAnalysisData }) => {
  // Load analysisData from props or localStorage (for persistence)
  const [analysisData, setAnalysisData] = useState(initialAnalysisData);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    if (!analysisData) {
      const savedData = localStorage.getItem("analysisData");
      if (savedData) {
        setAnalysisData(JSON.parse(savedData));
      }
    }
  }, [analysisData]);

  if (!analysisData) {
    return <p>No analysis data available. Please upload a report.</p>;
  }

  // Destructure the expected keys from analysisData
  const {
    totalSales,
    totalCOGS,
    profitOrLoss,
    productSales,
    lowSalesProducts,
    predictedSales,
    growthAnalysis,
    dailyDetails = [],
  } = analysisData;

  // Profit and Loss Summary data
  const profitLossSummary = [
    { metric: "Total Sales", value: totalSales },
    { metric: "Total COGS", value: totalCOGS },
    { metric: "Profit / Loss", value: profitOrLoss },
  ];

  // Product Sales Chart Data
  const productSalesChartData = {
    labels: productSales.rows.map((row) => row[0]),
    datasets: [
      {
        label: "Sales Volume",
        data: productSales.rows.map((row) => row[1]),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  // Low to High Sales Products Chart Data (sorted by sales ascending)
  const sortedLowSalesRows = [...lowSalesProducts.rows].sort(
    (a, b) => a[1] - b[1]
  );
  const lowSalesChartData = {
    labels: sortedLowSalesRows.map((row) => row[0]),
    datasets: [
      {
        label: "Sales (Low to High)",
        data: sortedLowSalesRows.map((row) => row[1]),
        backgroundColor: "rgba(255,159,64,0.2)",
        borderColor: "rgba(255,159,64,1)",
      },
    ],
  };

  // Predicted Sales Chart Data
  const predictedSalesChartData = {
    labels: ["Daily", "Monthly", "Yearly"],
    datasets: [
      {
        label: "Predicted Sales (Ksh)",
        data: [
          predictedSales.daily,
          predictedSales.monthly,
          predictedSales.yearly,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  // Sales Growth Analysis Chart Data
  const salesGrowthChartData = {
    labels: ["Daily", "Monthly", "Yearly"],
    datasets: [
      {
        label: "Sales Growth (%)",
        data: [
          growthAnalysis.daily_growth[0] * 100,
          growthAnalysis.monthly_growth[0] * 100,
          growthAnalysis.yearly_growth[0] * 100,
        ],
        borderColor: "rgba(153,102,255,1)",
        backgroundColor: "rgba(153,102,255,0.2)",
        fill: true,
      },
    ],
  };

  // COGS Analysis Chart Data: Compare overall Sales vs. COGS
  const cogsAnalysisChartData = {
    labels: ["Total Sales", "Total COGS"],
    datasets: [
      {
        label: "Amount (Ksh)",
        data: [totalSales, totalCOGS],
        backgroundColor: [
          "rgba(75,192,192,0.2)",
          "rgba(255,99,132,0.2)",
        ],
        borderColor: [
          "rgba(75,192,192,1)",
          "rgba(255,99,132,1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Date conversion function: convert input date to ISO format (YYYY-MM-DD)
  const convertToISO = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 10);
  };

  // Search functionality for Daily Details
  const handleSearch = () => {
    if (!dailyDetails.length) {
      setSearchResult("No daily details available.");
      return;
    }
    if (!searchProduct || !searchDate) {
      setSearchResult("Please enter both product name and date.");
      return;
    }
    const productLower = searchProduct.trim().toLowerCase();
    const normalizedSearchDate = convertToISO(searchDate);
    // Expecting each row: [day, product, sales, cogs, profit]
    const results = dailyDetails.filter((row) => {
      const [day, product] = row;
      return product.toLowerCase() === productLower && day === normalizedSearchDate;
    });
    setSearchResult(results.length ? results : "No records found.");
  };

  return (
    <div className="analysis-container p-4">
    <h2 className="text-3xl font-bold text-green-400 mb-4 font-[Poppins]">
        Financial Analysis Results
      </h2>

      {/* 1. Profit and Loss Summary */}
      <div className="profit-loss-summary mb-8 p-4 bg-gray-1000 rounded shadow">
        <h3 className="text-2xl text-green-300 mb-2 font-[Poppins]">
          Profit and Loss Summary
        </h3>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2">Metric</th>
              <th className="px-4 py-2">Value (Ksh)</th>
            </tr>
          </thead>
          <tbody>
            {profitLossSummary.map((item, idx) => (
              <tr key={idx} className="border-t border-green-700">
                <td className="px-4 py-2">{item.metric}</td>
                <td className="px-4 py-2">
                  {Number(item.value).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Product Sales Data */}
      <div className="product-sales-data mb-8">
        <h3 className="text-2xl text-green-300 mb-2 font-[Poppins]">
          Product Sales Data
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm bg-gray-900 rounded">
            <thead>
              <tr>
                {productSales.headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 border border-green-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productSales.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-green-700">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Product Sales Chart */}
      <div className="product-sales-chart mb-8">
        <h3 className="text-2xl text-green-300 mb-2 font-[Poppins]">
          Product Sales Chart
        </h3>
        <div className="chart-container my-4">
          <Bar data={productSalesChartData} />
        </div>
      </div>

      {/* 4. Low to High Sales Products Chart */}
      <div className="low-sales-chart mb-8">
        <h3 className="text-2xl text-green-300 mb-2 font-[Poppins]">
          Low to High Sales Products Chart
        </h3>
        <div className="chart-container my-4">
          <Bar data={lowSalesChartData} />
        </div>
      </div>

      {/* 5. Predicted Sales */}
      <div className="predicted-sales-chart mb-8">
        <h3 className="text-2xl text-green-300 mb-2 font-[Poppins]">
          Predicted Sales
        </h3>
        <div className="chart-container my-4">
          <Bar data={predictedSalesChartData} />
        </div>
      </div>

      {/* 6. Sales Growth Analysis */}
      <div className="sales-growth-analysis mb-8">
        <h3 className="text-2xl text-green-300 mb-2 font-[Poppins]">
          Sales Growth Analysis
        </h3>
        <div className="chart-container my-4">
          <Line data={salesGrowthChartData} />
        </div>
      </div>

      {/* 7. Cost of Goods Sold (COGS) Analysis */}
      <div className="cogs-analysis-chart mb-8">
        <h3 className="text-2xl text-green-300 mb-2 font-[Poppins]">
          Cost of Goods Sold (COGS) Analysis
        </h3>
        <div className="chart-container my-4">
          <Bar data={cogsAnalysisChartData} />
        </div>
      </div>

      {/* 8. Search Daily COGS, Sales, Profit & Loss Details */}
      <div className="search-section mb-8 p-4 bg-gray-800 rounded shadow">
        <h3 className="text-2xl text-green-300 mb-2 font-[Poppins]">
          Search Daily COGS, Sales, Profit & Loss Details
        </h3>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Enter Product Name"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            className="p-2 rounded bg-gray-700 text-green-300 font-[Poppins]"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="p-2 rounded bg-gray-700 text-green-300 font-[Poppins]"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 font-[Poppins]"
          >
            Search
          </button>
        </div>
        {searchResult && (
          <div className="search-result mt-4 overflow-x-auto">
            {typeof searchResult === "string" ? (
              <p>{searchResult}</p>
            ) : (
              <table className="min-w-full text-left text-sm bg-gray-900 rounded">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border border-green-700">
                      Date
                    </th>
                    <th className="px-4 py-2 border border-green-700">
                      Product
                    </th>
                    <th className="px-4 py-2 border border-green-700">
                      Sales
                    </th>
                    <th className="px-4 py-2 border border-green-700">
                      COGS
                    </th>
                    <th className="px-4 py-2 border border-green-700">
                      Profit
                    </th>
                    <th className="px-4 py-2 border border-green-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchResult.map((row, idx) => {
                    const [day, product, sales, cogs, profit] = row;
                    return (
                      <tr key={idx} className="border-t border-green-700">
                        <td className="px-4 py-2">{day}</td>
                        <td className="px-4 py-2">{product}</td>
                        <td className="px-4 py-2">{sales}</td>
                        <td className="px-4 py-2">{cogs}</td>
                        <td className="px-4 py-2">{profit}</td>
                        <td className="px-4 py-2">
                          {Number(profit) >= 0 ? "Profit" : "Loss"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;


