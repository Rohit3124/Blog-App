import { useEffect, useState, useContext } from "react";
import { userDataContext } from "../context/userContext";
import { Link } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const Posts = () => {
  const { user } = useContext(userDataContext);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState("");
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
  const handelDeletePost = async () => {
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${user._id}`,
        {
          method: "DELETE",
        }
      );
      const responseData = await res.json();
      if (res.ok) {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.error("Error during delete", error);
      alert(error.message || "Something went wrong. Please try again later.");
    }
  };
  return (
    <div>
      {user.isAdmin && userPosts.length > 0 ? (
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
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setPostIdToDelete(post._id);
                        document.getElementById("delete_modal").showModal();
                      }}
                    >
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
      ) : (
        <p>You have no posts yet!</p>
      )}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box w-1/3 max-w-xl ">
          <div className="text-center">
            <AiOutlineExclamationCircle className="h-14 w-14  text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-5">
              <form method="dialog">
                <button className="btn btn-error" onClick={handelDeletePost}>
                  Yes, I'm sure
                </button>
              </form>
              <form method="dialog">
                <button className="btn">No, cancel</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Posts;
