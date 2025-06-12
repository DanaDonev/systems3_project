import HowItWorksView from "./pages/HowItWorksView";
import AboutUsView from "./pages/AboutUsView";
import PageNotFound from "./pages/PageNotFound";
import ForumInitialView from "./pages/ForumInitialView";
import FooterView from "./components/FooterView";
import HeaderView from "./components/HeaderView";
import HomeView from "./pages/HomeView";
import SignUpView from "./pages/SignUpView";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignInView from "./pages/SignInView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeView />,
    errorElement: <PageNotFound />
  },
  {
    path: "/register",
    element: <SignUpView />
  },
  {
    path: "/signin",
    element: <SignInView />
  },
  {
    path: "/aboutus",
    element: <AboutUsView />
  },
  {
    path: "/forum",
    element: <ForumInitialView />
  },
  {
    path: "/howitworks",
    element: <HowItWorksView />
  },

]);

export default function App() {
  return (
    <div className="">
      <HeaderView />
      <RouterProvider router={router} />
      <FooterView />
    </div>
  );
}
