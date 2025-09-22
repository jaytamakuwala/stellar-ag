import SignUp from "@/pages/Auth/SignUp";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import EmailVerified from "@/pages/Auth/EmailVerified";
import Home from "@/pages/Home/Home";
import Features from "@/pages/Features/Features";
import Pricing from "@/pages/Pricing/Pricing";
import SignIn from "@/pages/Auth/SignIn";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import RefundPolicy from "../pages/RefuncPolicy/RefundPolicy";
import TermOfService from "../pages/TermService/TermOfService";
import OptionMain from "../pages/rowOptionData/RawOptionDataMain";
import MagicOptionMain from "../pages/MagicOptionData/magicOptionMain";
import MagicPutBuy from "../pages/MagicOptionData/MagicPutBuy";
import UnusualDataMain from "../pages/UnusualOptionData/UnusualDataMain";
import UltraHighVolumeDataMain from "../pages/UltraHighVolumeData/UltraHighVolumeMain";
import AnimatedTable from "../pages/AggregateRawData/AggrigatedRawMain";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/feature", element: <Features /> },
  { path: "/pricing", element: <Pricing /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/refund-policy", element: <RefundPolicy /> },
  { path: "/term-service", element: <TermOfService /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgotPassword", element: <ForgotPassword /> },
  { path: "/resetPassword", element: <ResetPassword /> },
  { path: "/emailVerified", element: <EmailVerified /> },
];

export const protectedRoutes = [
  { path: "/dashboard", element:  <AnimatedTable/>  },
  { path: "/optionMain", element: <OptionMain/> },
  { path: "/magicOptionMain", element:  <MagicOptionMain/>  },
  { path: "/magicPutBuy", element: <MagicPutBuy/> },
  { path: "/unusualDataMain", element: <UnusualDataMain/> },
  {
    path: "/UltraHighVolumeDataMain",
    element: <UltraHighVolumeDataMain/>,
  },
];
