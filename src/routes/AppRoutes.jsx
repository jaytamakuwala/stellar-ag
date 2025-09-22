import { Routes, Route } from "react-router-dom";
import { publicRoutes, protectedRoutes } from "./routeConfig";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "@/components/Layout/Layout.jsx";
import Home from "@/pages/Home/Home";
import Features from "@/pages/Features/Features";
import Pricing from "@/pages/Pricing/Pricing";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import RefundPolicy from "../pages/RefuncPolicy/RefundPolicy";
import TermOfService from "../pages/TermService/TermOfService";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Routes with header/nav */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/feature" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/term-service" element={<TermOfService />} />
      </Route>

      {/* Auth & other public routes (no header) */}
      {publicRoutes
        .filter((r) => !["/", "/feature", "/pricing"].includes(r.path))
        .map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        {protectedRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      {/* Fallback */}
      <Route element={<Layout />}>
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
