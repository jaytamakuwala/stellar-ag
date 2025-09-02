import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import StockTableGrid from "./pages/AggregateRawData/DualAgGrid";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import EmailVerified from "./pages/Authentication/EmailVerified";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import optionMain from "./pages/rowOptionData/optionMain"

ModuleRegistry.registerModules([AllCommunityModule]);

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
            <Route path="/optionMain" Component={optionMain} />
          </Route>
          <Route path="*" element={<SignIn />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
