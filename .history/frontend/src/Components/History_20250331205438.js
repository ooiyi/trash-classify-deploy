// components/History.js
import React from "react";
import "../App.css";

const History = ({
  history,
  filterName,
  setFilterName,
  filterDate,
  setFilterDate,
  uniqueNames,
  uniqueDates
}) => (
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

    {history.length > 0 ? (
      history.map((item, index) => (
        <div key={index} className="history-card">
          <h3>{item.name} - {item.date}</h3>
          {item.data.map((d, i) => (
            <div key={i}>
              <p><strong>Filename:</strong> {d.filename}</p>
              <p><strong>Type:</strong> {d.type}</p>
              <p><strong>Detection ID:</strong> {d.detectionId || "-"}</p>
              <p><strong>Latitude:</strong> {d.latitude || "-"}</p>
              <p><strong>Longitude:</strong> {d.longitude || "-"}</p>
              <p><strong>Location:</strong> {d.location || "-"}</p>
              <p><strong>Timestamp:</strong> {d.timestamp || "-"}</p>
              <hr />
            </div>
          ))}
        </div>
      ))
    ) : (
      <p>No uploads found for selected filters.</p>
    )}
  </>
);

export default History;
