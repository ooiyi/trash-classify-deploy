import Navbar from "./components/Navbar";
import Classification from "./components/Classification";
import History from "./components/History";

const App = () => {
  // App component logic here

  return (
    <div className="App">
      <Navbar userName={userName} setCurrentSection={setCurrentSection} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
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
      <History 
        filteredHistory={filteredHistory} 
        filterName={filterName} 
        setFilterName={setFilterName} 
        filterDate={filterDate} 
        setFilterDate={setFilterDate} 
        uniqueNames={uniqueNames} 
        uniqueDates={uniqueDates} 
      />
    </div>
  );
};

export default App;