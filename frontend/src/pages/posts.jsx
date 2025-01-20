import { useEffect, useState, useContext } from "react";
import { userDataContext } from "../context/userContext";
import { Link } from "react-router-dom";

const Posts = () => {
  const { user } = useContext(userDataContext);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${user._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (user.isAdmin) fetchPosts();
  }, [user._id]);
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${user._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-xs table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th></th>
              <td>Date Updated</td>
              <td>Post Image</td>
              <td>Post Title</td>
              <td>Category</td>
              <td>Delete</td>
              <td>Edit</td>
            </tr>
          </thead>
          <tbody className="divide-y">
            {userPosts.map((post, index) => (
              <tr key={index} className="">
                <th>{index + 1}</th>
                <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </td>
                <td className="font-medium text-gray-900">
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </td>
                <td>{post.category}</td>
                <td>
                  <span className="font-medium text-red-500 hover:underline cursor-pointer">
                    Delete
                  </span>
                </td>
                <td>
                  <Link
                    to={`update-post/${post._id}`}
                    className="text-teal-500 hover:underline"
                  >
                    <span>Edit</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showMore && (
          <button
            className="w-full text-teal-500 self-center text-sm py-7"
            onClick={handleShowMore}
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default Posts;
