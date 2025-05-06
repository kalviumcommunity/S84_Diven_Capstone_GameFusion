import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/firstPage";
import SecondPage from "./pages/secondPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/second" element={<SecondPage />} />
      </Routes>
    </Router>
  );
}

export default App;
