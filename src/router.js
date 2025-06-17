import { createBrowserRouter } from "react-router-dom";

import HomeView from "./pages/HomeView";
import AboutUsView from "./pages/AboutUsView";
import HowItWorksView from "./pages/HowItWorksView";
import ForumInitialView from "./pages/ForumInitialView";
import SignInView from "./pages/SignInView";
import SignUpView from "./pages/SignUpView";
import PageNotFound from "./pages/PageNotFound";

import { protectedLoader } from "./loaders/authLoader";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeView />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/register",
    element: <SignUpView />,
  },
  {
    path: "/signin",
    element: <SignInView />,
  },
  {
    path: "/aboutus",
    element: <AboutUsView />,
  },
  {
    path: "/howitworks",
    element: <HowItWorksView />,
  },
  {
    path: "/forum",
    element: <ForumInitialView />,
    //loader: protectedLoader,  // ✅ Protects the /forum route
  },
]);

export default router;
