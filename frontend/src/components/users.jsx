import { useEffect, useState, useContext } from "react";
import { userDataContext } from "../context/userContext";
import { Link } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

const Users = () => {
  const { user } = useContext(userDataContext);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/user/getusers");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (user.isAdmin) fetchPosts();
  }, [user._id]);
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handelDeleteUser = async () => {
    //   try {
    //     const res = await fetch(
    //       `/api/user/deleteuser/${userIdToDelete}/${user._id}`,
    //       {
    //         method: "DELETE",
    //       }
    //     );
    //     const responseData = await res.json();
    //     if (res.ok) {
    //       setUserPosts((prev) =>
    //         prev.filter((post) => post._id !== postIdToDelete)
    //       );
    //     }
    //   } catch (error) {
    //     console.error("Error during delete", error);
    //     alert(error.message || "Something went wrong. Please try again later.");
    //   }
  };
  return (
    <div>
      {user.isAdmin && users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-xs table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <th></th>
                <td>Date Created</td>
                <td>Username</td>
                <td>Email</td>
                <td>Admin</td>
                <td>Delete</td>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user, index) => (
                <tr key={index} className="">
                  <th>{index + 1}</th>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </td>
                  <td>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setUserIdToDelete(user._id);
                        document.getElementById("delete_modal").showModal();
                      }}
                    >
                      Delete
                    </span>
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
        <p>There is no users yet!</p>
      )}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box w-1/3 max-w-xl ">
          <div className="text-center">
            <AiOutlineExclamationCircle className="h-14 w-14  text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-5">
              <form method="dialog">
                <button className="btn btn-error" onClick={handelDeleteUser}>
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

export default Users;
