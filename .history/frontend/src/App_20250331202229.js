import { useState } from "react";
import Navbar from "./components/Navbar";
import Classification from "./components/Classification";
import History from "./components/History";

const App = () => {
  const [userName, setUserName] = useState("User");
  const [currentSection, setCurrentSection] = useState("classification");
  const [menuOpen, setMenuOpen] = useState(false);

  const [files, setFiles] = useState([]);
  const [uploadName, setUploadName] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [totalCounts, setTotalCounts] = useState({ plastic: 0, metal: 0, glass: 0 });

  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [uniqueNames, setUniqueNames] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);

  // Dummy handlers to avoid undefined error
  const getRootProps = () => ({});
  const getInputProps = () => ({});
  const handleUpload = () => {
    alert("Upload handler triggered");
  };

  return (
    <div className="App">
      <Navbar
        userName={userName}
        setCurrentSection={setCurrentSection}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
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
          filteredHistory={filteredHistory}
          filterName={filterName}
          setFilterName={setFilterName}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          uniqueNames={uniqueNames}
          uniqueDates={uniqueDates}
        />
      )}
    </div>
  );
};

export default App;