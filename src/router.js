import { createBrowserRouter, Outlet, useParams } from "react-router-dom";

import FooterView from "./components/FooterView";
import HeaderView from "./components/HeaderView";
import { HomeView, AboutUsView, HowItWorksView, ForumView, ForumInitialView, SignInView, SignUpView, CreatePostView, PageNotFound, ListingView } from "./pages";
import { protectedLoader } from "./loaders/authLoader";
import MakeListingView from "./pages/MakeListingView";
import ProfileView from "./pages/ProfileView";
import ResetPasswordView from "./pages/ResetPasswordView";


function ForumViewWrapper() {
  const { pet, category } = useParams();
  const categoryParam = category || "";
  return <ForumView pet={pet} category={categoryParam} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <><HeaderView /><HomeView /><FooterView /></>,
    errorElement: <PageNotFound />,
  },
  {
    path: "/register",
    element: <><HeaderView /><SignUpView /><FooterView /></>,
  },
  {
    path: "/signin",
    element: <><HeaderView /><SignInView /><FooterView /></>,
  },
  {
    path: "/aboutus",
    element: <><HeaderView /><AboutUsView /><FooterView /></>,
  },
  {
    path: "/howitworks",
    element: <><HeaderView /><HowItWorksView /><FooterView /></>,
  },
  {
    path: "/forum",
    element: <><HeaderView /><Outlet /><FooterView /></>,
    children: [
      { index: true, element: <ForumInitialView /> },
      { path: ":pet", element: <ForumViewWrapper /> },
      { path: ":pet/:category", element: <ForumViewWrapper /> },
    ],
  },
  {
    path: "/createpost", //pass values for pet and category as query parameters
    // e.g. /createpost?pet=dog&category=adoption
    // this is a protected route, only accessible to logged in users
    element: <><HeaderView /><CreatePostView /></>, //pass parameters if therer are any
    // loader: protectedLoader,
  },
  {
    path: "/listing",
    element: <><HeaderView /><ListingView /><FooterView /></>,
  },
  {
    path: "/createlisting",
    element: <><HeaderView /><MakeListingView /><FooterView /></>,
  },
  {
    path: "/profile",
    element: <><HeaderView /><ProfileView /><FooterView /></>,
  },
  {
    path: "/resetpassword/:token",
    element: <><HeaderView /><ResetPasswordView/><FooterView /></>,
  }
]);

export default router;