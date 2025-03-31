import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "./App.css";

const App = () => {
  const [userName, setUserName] = useState(""); // for welcome screen
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState("classification");

  const [files, setFiles] = useState([]);
  const [uploadName, setUploadName] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalCounts, setTotalCounts] = useState({ plastic: 0, metal: 0, glass: 0 });
  const [history, setHistory] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");

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
    if (!uploadName.trim()) {
      alert("Please enter a name for this upload.");
      return;
    }

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

        const newEntry = {
          name: uploadName.trim(),
          date: new Date().toLocaleDateString(),
          data: response.data,
          files,
        };

        setHistory((prev) => [...prev, newEntry]);
        setUploadName("");
        setFiles([]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing files.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(entry => {
    return (
      (!filterName || entry.name === filterName) &&
      (!filterDate || entry.date === filterDate)
    );
  });

  const uniqueNames = [...new Set(history.map(h => h.name))];
  const uniqueDates = [...new Set(history.map(h => h.date))];

  // ----------------------------
  // UI COMPONENTS
  // ----------------------------

  const renderWelcomeScreen = () => (
    <div className="welcome-screen">
      <h1>Welcome to Trash Classification</h1>
      <input
        type="text"
        placeholder="Enter your name or session"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button
        className="start-button"
        disabled={!userName.trim()}
        onClick={() => setSessionStarted(true)}
      >
        Get Started
      </button>
    </div>
  );

  const renderNavbar = () => (
    <nav className="navbar">
      <span className="nav-user">👋 {userName}</span>
      <button onClick={() => setCurrentSection("classification")}>
        Classification
      </button>
      <button onClick={() => setCurrentSection("history")}>History</button>
    </nav>
  );

  const renderClassification = () => (
    <>
      <h2>Upload Trash for Classification</h2>

      <div className="input-group">
        <label htmlFor="uploadName">Upload Name (required):</label>
        <input
          id="uploadName"
          type="text"
          value={uploadName}
          onChange={(e) => setUploadName(e.target.value)}
          placeholder="e.g., Campus Cleanup"
        />
      </div>

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {files.length > 0 ? (
          files.map((file, index) => <p key={index}>{file.name}</p>)
        ) : (
          <p>Drag & Drop or Click to Upload Images/Videos</p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={loading || !uploadName.trim()}
        className="upload-button"
      >
        {loading ? "Processing..." : "Classify"}
      </button>

      <div className="totals">
        <h3>Total Count:</h3>
        <p>Plastic: {totalCounts.plastic}</p>
        <p>Metal: {totalCounts.metal}</p>
        <p>Glass: {totalCounts.glass}</p>
      </div>

      {results && (
        <div className="result-section">
          <h3>Classification Results</h3>
          {Object.keys(results).map((filename, index) => (
            <div key={index} className="result-card">
              <h4>{filename}</h4>
              <p>Plastic: {results[filename].plastic}</p>
              <p>Metal: {results[filename].metal}</p>
              <p>Glass: {results[filename].glass}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderHistory = () => (
    <>
      <h2>Upload History</h2>

      <div className="filters">
        <select onChange={(e) => setFilterName(e.target.value)} value={filterName}>
          <option value="">Filter by Upload Name</option>
          {uniqueNames.map((name, i) => (
            <option key={i} value={name}>{name}</option>
          ))}
        </select>
        <select onChange={(e) => setFilterDate(e.target.value)} value={filterDate}>
          <option value="">Filter by Date</option>
          {uniqueDates.map((date, i) => (
            <option key={i} value={date}>{date}</option>
          ))}
        </select>
      </div>

      {filteredHistory.length > 0 ? (
        filteredHistory.map((item, index) => (
          <div key={index} className="history-card">
            <h3>{item.name} - {item.date}</h3>
            {Object.keys(item.data).map((file, i) => (
              <div key={i}>
                <h4>{file}</h4>
                <p>Plastic: {item.data[file].plastic}</p>
                <p>Metal: {item.data[file].metal}</p>
                <p>Glass: {item.data[file].glass}</p>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No uploads found for selected filters.</p>
      )}
    </>
  );

  // ----------------------------
  // MAIN RETURN
  // ----------------------------
  return (
    <div className="App">
      {!sessionStarted ? (
        renderWelcomeScreen()
      ) : (
        <div className="App-header">
          {renderNavbar()}
          {currentSection === "classification"
            ? renderClassification()
            : renderHistory()}
        </div>
      )}
    </div>
  );
};

export default App;
