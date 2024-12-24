import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/Sign-in",
      element: <SignIn />,
    },
    {
      path: "/Sign-up",
      element: <SignUp />,
    },
  ]);
  return <RouterProvider router={router} />;
}
