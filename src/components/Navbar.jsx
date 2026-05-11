function Navbar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: "feed", label: "Ride Feed" },
    { id: "create", label: "Post Ride" },
    { id: "dashboard", label: "Driver Dashboard" },
    { id: "login", label: "Login" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => setCurrentPage("feed")}>
        RideLink
      </div>

      <div className="nav-links">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={currentPage === item.id ? "active-nav" : ""}
            onClick={() => setCurrentPage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;