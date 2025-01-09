import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { userDataContext } from "../context/userContext";

const schema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).max(100).required(),
});

const SignIn = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userDataContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      if (res.ok) {
        setUser(responseData.username);
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
            "Sign In"
          )}
        </button>
      </form>
      <div className="flex gap-2 text-sm mt-5">
        <span>Don't have an account?</span>
        <Link to="/sign-up" className="text-blue-500">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
