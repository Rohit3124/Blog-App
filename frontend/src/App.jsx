import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/header";
import UserProfile from "./components/userProfile";
import PrivateRoute from "./components/privateRoute";
import CreatePost from "./pages/createPost";
import Posts from "./pages/posts";
import OnlyAdminPrivateRoute from "./components/onlyAdminPrivateRoute";
import UpdatePost from "./pages/updatePost";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<UserProfile />} />
        </Route>
        <Route path="/posts" element={<Posts />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts/update-post/:postId" element={<UpdatePost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
