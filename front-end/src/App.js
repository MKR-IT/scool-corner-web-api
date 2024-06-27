import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddDonation from "./pages/AddDonation";
import AddWithdrawal from "./pages/AddWithdrawal";
import EditDonation from "./pages/EditDonation";
import HomeAdmin from "./pages/HomeAdmin";
import Login from "./pages/Login";
import { AuthContext } from "./helpers/AuthContext";
import { useEffect, useState } from "react";

function App() {
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setAuthState(true);
    }
  }, []);

  console.log("render app.js");
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {authState && (
                <>
                  <li>
                    <Link to="/admin"> Admin</Link>
                  </li>
                  <li>
                    <Link to="/donate"> Donate</Link>
                  </li>
                  <li>
                    <Link to="/withdraw"> Withdraw</Link>
                  </li>
                </>
              )}
              {!authState && (
                <>
                  <li>
                    <Link to="/login"> Login</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<AddDonation />} />
            <Route path="/withdraw" element={<AddWithdrawal />} />
            <Route path="/admin" element={<HomeAdmin />} />
            <Route path="/donation/:id" element={<EditDonation />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
