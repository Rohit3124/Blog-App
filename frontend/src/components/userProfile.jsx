const UserProfile = () => {
  return (
    <div className="w-96 mx-auto">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form action="" className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
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
