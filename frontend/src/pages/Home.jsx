import { useEffect, useState, useContext } from "react";
import { userDataContext } from "../context/userContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useContext(userDataContext);
  const [Posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          if (data.posts.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, [user._id]);
  const handleShowMore = async () => {
    const startIndex = Posts.length;
    try {
      const res = await fetch(`/api/post/getposts?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      {Posts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-xs table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <th></th>
                <td>Post Image</td>
                <td>Post Title</td>
                <td>Category</td>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Posts.map((post, index) => (
                <tr key={index} className="">
                  <th>{index + 1}</th>

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
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
};

export default Home;
