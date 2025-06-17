import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import LandingPage from "./pages/firstPage";
import SecondPage from "./pages/secondPage";
import AuthPage from "./pages/authPage";
import WishlistPage from "./pages/WishlistPage";
import SearchResultsPage from "./pages/SearchResultsPage";

function App() {
  return (
    <WishlistProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/second" element={<SecondPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </Router>
    </WishlistProvider>
  );
}

export default App;
