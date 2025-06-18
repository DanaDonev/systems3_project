import { createBrowserRouter, useParams } from "react-router-dom";

import FooterView from "./components/FooterView";
import HeaderView from "./components/HeaderView";
import { HomeView, AboutUsView, HowItWorksView, ForumView, ForumInitialView, SignInView, SignUpView, CreatePostView, PageNotFound, ListingView } from "./pages";

import { protectedLoader } from "./loaders/authLoader";

function ForumViewWrapper() {
  const { pet, category } = useParams();
  return <ForumView pet={pet} category={category} />;
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
    element: <><HeaderView /><ForumInitialView /><FooterView /></>,
    // loader: protectedLoader,
    // children: [
    //   {
    //     path: ":pet",
    //     element: <ForumView />,
    //     // loader: protectedLoader,
    //   },
    //   {
    //     path: ":pet/:category",
    //     element: <ForumView />,
    //     // loader: protectedLoader,
    //   },
    // ],
  },
  {
    path: "/forum/:pet",
    element: <><HeaderView /><ForumView /><FooterView /></>,
    // loader: protectedLoader,
  },
  {
    path: "/forum/:pet/:category",
    element: (
      <>
        <HeaderView /><ForumViewWrapper /><FooterView />
      </>
    ),
    // loader: protectedLoader,
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
  }
]);

export default router;