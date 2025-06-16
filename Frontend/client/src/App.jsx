import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/firstPage";
import SecondPage from "./pages/secondPage";
import AuthPage from "./pages/authPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/second" element={<SecondPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
