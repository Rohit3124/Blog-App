import { useState, useRef, useEffect, useContext } from "react";
import { userDataContext } from "../context/userContext.jsx";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import defaultUserImg from "../assets/defaultUserImg.webp";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const schema = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).max(100).required(),
});
const UserProfile = () => {
  const { user } = useContext(userDataContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      username: user.username,
      email: user.email,
    },
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(e.target.files[0]);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);
  const uploadImage = async () => {
    console.log("uploading image...");
  };
  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/user/update/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await res.json();
    } catch (error) {
      console.error("Error during update", error);
      alert(error.message || "Something went wrong. Please try again later.");
    }
  };
  return (
    <div className="w-96 mx-auto">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form
        action=""
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="w-32 h-32 self-center cursor-pointer"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            alt="Tailwind CSS Navbar component"
            src={imageFileUrl || defaultUserImg}
            className="rounded-full w-full h-full object-cover border-8"
          />
        </div>
        <input
          className="input input-bordered"
          type="text"
          placeholder="username"
          {...register("username")}
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
        <input
          className="input input-bordered"
          type="text"
          placeholder="email"
          {...register("email")}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input
          className="input input-bordered"
          type="text"
          placeholder="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        <button className="btn  btn-active" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Update"
          )}
        </button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span
          className="cursor-pointer"
          onClick={() => document.getElementById("delete_modal").showModal()}
        >
          Delate Account
        </span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      <dialog id="delete_modal" className="modal">
        <div className="modal-box w-11/12 max-w-3xl ">
          <div className="text-center">
            <AiOutlineExclamationCircle className="h-14 w-14  text-gray-400 mb-4 mx-auto" />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UserProfile;
