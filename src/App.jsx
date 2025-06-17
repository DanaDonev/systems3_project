import FooterView from "./components/FooterView";
import HeaderView from "./components/HeaderView";
import { RouterProvider } from "react-router-dom";
//import { AuthProvider } from "./AuthContext";
import router from "./router";

export default function App() {
  return (
    //the div might be extra
    <div className="">
      {/* //<AuthProvider> */}
        <HeaderView />
        <RouterProvider router={router} />
        <FooterView />
      {/* //</AuthProvider> */}
    </div>
  );
}
