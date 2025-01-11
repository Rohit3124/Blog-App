import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/header";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/privateRoute";
import userProfile from "./components/userProfile";
import UserProfile from "./components/userProfile";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "sign-in",
          element: <SignIn />,
        },
        {
          path: "sign-up",
          element: <SignUp />,
        },
        {
          path: "profile",
          element: <UserProfile />,
        },

        {
          element: <PrivateRoute />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
