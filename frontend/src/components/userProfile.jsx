import { useState, useRef, useEffect } from "react";

const UserProfile = () => {
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
  return (
    <div className="w-96 mx-auto">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form action="" className="flex flex-col gap-4">
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
            src={
              imageFileUrl ||
              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            }
            className="rounded-full w-full h-full object-cover border-8"
          />
        </div>
        <input
          className="input input-bordered"
          type="text"
          id="username"
          placeholder="username"
        />
        <input
          className="input input-bordered"
          type="text"
          id="email"
          placeholder="email"
        />
        <input
          className="input input-bordered"
          type="text"
          id="password"
          placeholder="password"
        />
        <button className="btn  btn-active">Update</button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delate Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default UserProfile;
