import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload({ setAnalysisData }) {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "https://aimodel-yq14.onrender.com";

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name || "");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.error || `Server Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Upload Successful! Server Response:", data);

      // Save the data in state and localStorage for persistence
      setAnalysisData(data);
      localStorage.setItem("analysisData", JSON.stringify(data));

      // Navigate to the analysis page
      navigate("/analysis");
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError("Failed to upload file: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container font-[Poppins]">
      <h2>Upload Financial Report</h2>
      <input type="file" onChange={handleFileChange} />
      <button 
        onClick={handleUpload} 
        disabled={uploading}
        className="px-6 py-3 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition font-[Poppins]"
      >
        {uploading ? "Uploading..." : "Analyze Report"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Upload;




