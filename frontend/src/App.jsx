import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/header";
import UserProfile from "./components/userProfile";
import CreatePost from "./pages/createPost";

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
          path: "create-post",
          element: <CreatePost />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
