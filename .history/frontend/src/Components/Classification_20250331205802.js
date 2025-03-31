// components/Classification.js
import React from "react";
import "../App.css";

const Classification = ({
  files,
  getRootProps,
  getInputProps,
  uploadName,
  setUploadName,
  handleUpload,
  loading,
  results,
  totalCounts,
}) => (
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
        <h3>Detection Results</h3>
        {results.map((item, i) => (
          <div key={i} className="result-card">
            <h4>📄 Filename: {item.filename || "Unknown"}</h4>
            {files.find((f) => f.name === item.filename) && (
              <img
                src={URL.createObjectURL(files.find((f) => f.name === item.filename))}
                alt={item.filename}
                style={{ width: "200px", borderRadius: "8px", marginBottom: "10px" }}
              />
            )}
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Detection ID:</strong> {item.detectionId || "-"}</p>
            <p><strong>Latitude:</strong> {item.latitude || "-"}</p>
            <p><strong>Longitude:</strong> {item.longitude || "-"}</p>
            <p><strong>Location:</strong> {item.location || "-"}</p>
            <p><strong>Timestamp:</strong> {item.timestamp || "-"}</p>
            <hr />
          </div>
        ))}
      </div>
    )}
  </>
);

export default Classification;