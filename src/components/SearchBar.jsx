function SearchBar({ searchTerm, setSearchTerm }) {
    return (
      <div className="search-bar card">
        <label htmlFor="ride-search">Search rides</label>
        <input
          id="ride-search"
          type="text"
          placeholder="Search by origin, destination, driver, or college..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
    );
  }
  
  export default SearchBar;