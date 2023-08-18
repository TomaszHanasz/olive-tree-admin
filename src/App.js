import Admin from "./pages/Admin";
import "./App.css";
import SignIn from "./pages/SignIn/SignIn";
import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
