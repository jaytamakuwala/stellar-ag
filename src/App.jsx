import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import StockTableGrid from "./pages/StockTableGrid";
import Header from "./pages/Header";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerified from "./pages/EmailVerified";
import {Toaster} from 'react-hot-toast'
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <UserProvider>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/signin" Component={SignIn} />
          <Route path="/signup" Component={SignUp} />
          <Route path="/forgotPassword" Component={ForgotPassword} />
          <Route path="/resetPassword" Component={ResetPassword} />
          <Route path="/emailVerified" Component={EmailVerified} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" Component={StockTableGrid} />
          </Route>
          <Route path="*" element={<SignIn />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
