import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/firstPage";
import SecondPage from "./pages/secondPage";
import AuthPage from "./pages/authPage";
import WishlistPage from "./pages/WishlistPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import GameDetailsPage from "./pages/GameDetailsPage";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <WishlistProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/second" element={<SecondPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/game/:id" element={<GameDetailsPage />} />
          </Routes>
        </WishlistProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
