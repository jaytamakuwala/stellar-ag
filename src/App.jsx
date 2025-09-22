import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserContext";
import AppRoutes from "@/routes/AppRoutes";
import ScrollToTop from "./routes/ScrollToTop";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function App() {
  return (
    <>
      {/* <CssBaseline /> */}

      <UserProvider>
        <Toaster />
        <Router>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </UserProvider>
    </>
  );
}
