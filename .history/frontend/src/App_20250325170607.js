import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import './App.css'; // 👈 Import the CSS file

const App = () => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalCounts, setTotalCounts] = useState({ plastic: 0, metal: 0, glass: 0 });
  const [history, setHistory] = useState([]); // 👈 Track previous uploads

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*, video/*",
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      setResults(null);
      setTotalCounts({ plastic: 0, metal: 0, glass: 0 });
    },
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please upload images or videos.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setResults(response.data);

        let totalPlastic = 0, totalMetal = 0, totalGlass = 0;
        Object.values(response.data).forEach((counts) => {
          totalPlastic += counts.plastic;
          totalMetal += counts.metal;
          totalGlass += counts.glass;
        });

        setTotalCounts({ plastic: totalPlastic, metal: totalMetal, glass: totalGlass });

        // 👇 Save to history
        setHistory((prev) => [...prev, { data: response.data, files }]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing files. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Trash Classification</h1>

        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {files.length > 0 ? (
            files.map((file, index) => <p key={index}>{file.name}</p>)
          ) : (
            <p>Drag & Drop or Click to Upload Multiple Images/Videos</p>
          )}
        </div>

        <button onClick={handleUpload} disabled={loading} className="upload-button">
          {loading ? "Processing..." : "Classify"}
        </button>

        <div className="totals">
          <h2>Total Count:</h2>
          <p>Plastic: {totalCounts.plastic}</p>
          <p>Metal: {totalCounts.metal}</p>
          <p>Glass: {totalCounts.glass}</p>
        </div>

        {results && (
          <div className="result-section">
            <h2>Current Classification Results</h2>
            {Object.keys(results).map((filename, index) => (
              <div key={index} className="result-card">
                <h3>{filename}</h3>
                <p>Plastic: {results[filename].plastic}</p>
                <p>Metal: {results[filename].metal}</p>
                <p>Glass: {results[filename].glass}</p>
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <h2>Previous Classification History</h2>
            {history.map((item, index) => (
              <div key={index} className="history-card">
                <h3>Upload #{index + 1}</h3>
                {Object.keys(item.data).map((file, i) => (
                  <div key={i}>
                    <h4>{file}</h4>
                    <p>Plastic: {item.data[file].plastic}</p>
                    <p>Metal: {item.data[file].metal}</p>
                    <p>Glass: {item.data[file].glass}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
