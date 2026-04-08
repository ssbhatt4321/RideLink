function Navbar({ setCurrentPage }) {
    return (
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setCurrentPage("feed")}>
          RideLink
        </div>
  
        <div className="nav-links">
          <button onClick={() => setCurrentPage("feed")}>Ride Feed</button>
          <button onClick={() => setCurrentPage("create")}>Post Ride</button>
          <button onClick={() => setCurrentPage("login")}>Login</button>
        </div>
      </nav>
    );
  }
  
  export default Navbar;