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
import OptionMain from "./pages/rowOptionData/optionMain";
import MagicOptionMain from "./pages/MagicOptionData/magicOptionMain";
import UnusualDataMain from "./pages/UnusualOptionData/UnusualDataMain";
import UltraHighVolumeDataMain from "./pages/UltraHighVolumeData/UltraHighVolumeMain";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function App() {
  return (
    <UserProvider>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/emailVerified" element={<EmailVerified />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<StockTableGrid />} />
            <Route path="/optionMain" element={<OptionMain />} />
            <Route path="/magicOptionMain" element={<MagicOptionMain />} />
            <Route path="/UnusualDataMain" element={<UnusualDataMain />} />
            <Route
              path="/UltraHighVolumeDataMain"
              element={<UltraHighVolumeDataMain />}
            />
          </Route>
          <Route path="*" element={<SignIn />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
