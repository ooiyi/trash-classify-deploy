import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Navbar from "./Components/Navbar";
import Classification from "./Components/Classification";
import History from "./Components/History";
import "./App.css";

const App = () => {
  const [userName, setUserName] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState("classification");
  const [menuOpen, setMenuOpen] = useState(false);
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
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        const detections = response.data;
        setResults(detections);

        let totalPlastic = 0, totalMetal = 0, totalGlass = 0;
        detections.forEach(d => {
          if (d.type === "Plastic") totalPlastic++;
          if (d.type === "Metal") totalMetal++;
          if (d.type === "Glass") totalGlass++;
        });

        setTotalCounts({ plastic: totalPlastic, metal: totalMetal, glass: totalGlass });

        const newEntry = {
          name: uploadName.trim(),
          date: new Date().toLocaleDateString(),
          data: detections,
          files,
        };

        setHistory(prev => [...prev, newEntry]);
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

  const filteredHistory = history.filter(entry => (
    (!filterName || entry.name === filterName) &&
    (!filterDate || entry.date === filterDate)
  ));

  const uniqueNames = [...new Set(history.map(h => h.name))];
  const uniqueDates = [...new Set(history.map(h => h.date))];

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

  return (
    <div className="App">
      {!sessionStarted ? (
        renderWelcomeScreen()
      ) : (
        <div className="App-header">
          <Navbar
            userName={userName}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            setCurrentSection={setCurrentSection}
          />

          {currentSection === "classification" ? (
            <Classification
              files={files}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              uploadName={uploadName}
              setUploadName={setUploadName}
              handleUpload={handleUpload}
              loading={loading}
              results={results}
              totalCounts={totalCounts}
            />
          ) : (
            <History
              history={filteredHistory}
              filterName={filterName}
              setFilterName={setFilterName}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              uniqueNames={uniqueNames}
              uniqueDates={uniqueDates}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
