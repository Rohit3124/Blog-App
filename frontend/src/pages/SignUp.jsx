import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { userDataContext } from "../context/userContext";

const schema = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).max(100).required(),
});

const SignUp = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(userDataContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await res.json();
      if (res.ok) {
        setUser(responseData.user);
        navigate("/");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(error.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="w-96 mx-auto mt-20">
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit(onSubmit)}>
        <label className="input input-bordered flex  items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Username"
            {...register("username")}
          />
        </label>
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            className="grow"
            placeholder="Email"
            {...register("email")}
          />
        </label>
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            placeholder="password"
            {...register("password")}
          />
        </label>
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        <button className="btn  btn-active" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      <div className="flex gap-2 text-sm mt-5">
        <span>Have an account?</span>
        <Link to="/sign-in" className="text-blue-500">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
