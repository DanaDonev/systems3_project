import { createBrowserRouter, Outlet, useParams } from "react-router-dom";
import { HeaderView, FooterView, CreatePostView } from "./components";
import { HomeView, AboutUsView, HowItWorksView, ForumView, ForumInitialView, SignInView, SignUpView, PageNotFound, ListingView, MakeListingView, ProfileView, ResetPasswordView, ThankYouView, RateDealView } from "./pages";

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
    path: "/createpost",
    element: <><HeaderView /><CreatePostView /></>,
  },
  {
    path: "/listing",
    element: <><HeaderView /><ListingView /></>,
  },
  {
    path: "/createlisting",
    element: <><HeaderView /><MakeListingView /><FooterView /></>,
  },
  {
    path: "/profile",
    element: <><HeaderView /><ProfileView /></>,
  },
  {
    path: "/resetpassword/:token",
    element: <><HeaderView /><ResetPasswordView /><FooterView /></>,
  },
  {
    path: "/thankyou",
    element: <><ThankYouView /><FooterView /></>,
  },
  {
    path: "/ratedeal/:dealId",
    element: <><HeaderView /><RateDealView /><FooterView /></>,
  }
]);

export default router;