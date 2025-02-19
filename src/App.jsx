import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PayPalDonateButton from "./components/PayPalDonateButton";
import Upload from "./components/Upload";
import AnalysisPage from "./components/AnalysisPage";

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-100 backdrop-blur-lg text-green-400">
        <div className="max-w-5xl p-11 text-center border border-green-500 rounded-2xl shadow-lg bg-gray-900 bg-opacity-30">
          <h1 className="text-4xl font-extrabold text-green-400 mb-6 drop-shadow-lg">
            Welcome to Financial Data Analytics
          </h1>
          <p className="text-lg text-green-300 mb-6">
            Experience the power of AI-driven financial insights. Upload your financial report and get deep analytics instantly.
          </p>

          <div className="border border-green-900 p-8 rounded-lg bg-black bg-opacity-200 shadow-inner">
            <h2 className="text-3xl font-semibold text-green-500 mb-4">Required Data & Expected Output</h2>
            <p className="text-green-300">
              <strong>Excel Format Requirements:</strong> Your file should contain:
            </p>
            <ul className="list-disc list-inside text-yellow-300 mt-4">
              <p><strong>Product:</strong> Name or identifier</p>
              <p><strong>Date:</strong> Sale date (YYYY-MM-DD)</p>
              <p><strong>Sales:</strong> Sales value</p>
              <p><strong>cogs:</strong> Cost of goods sold</p>
            </ul>
          </div>

          {/* Routing Logic */}
          <Routes>
            <Route path="/" element={<Upload setAnalysisData={setAnalysisData} />} />
            <Route path="/analysis" element={<AnalysisPage analysisData={analysisData} />} />
          </Routes>

          {/* PayPal Donate Button */}
          <PayPalDonateButton />
        </div>
      </div>
    </Router>
  );
}

export default App;
