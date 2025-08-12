import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();

  return (
    <nav style={{ padding: "10px", display: "flex", justifyContent: "center", borderBottom: "2px solid #575757" }}>
      {location.pathname !== "/" && (
        <Link to="/" className="button">
          Archive
        </Link>
      )}
      {location.pathname !== "/view" && (
        <Link to="/view" className="button">
          View Archives
        </Link>
      )}
    </nav>
  );
}

export default NavBar;
