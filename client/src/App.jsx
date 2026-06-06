// ─────────────────────────────────────────────────────────
//  App — Root component with routing
// ─────────────────────────────────────────────────────────

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StreamPage from "./pages/StreamPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar appears on every page */}
        <Navbar />

        {/* Page routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stream/:streamKey" element={<StreamPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
