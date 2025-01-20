import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const schema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  content: Joi.string().required(),
});

const CreatePost = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      if (res.ok) {
        navigate(`/post/${responseData.slug}`);
      }
    } catch (error) {
      console.error("Error during creating post", error);
      alert(error.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            className="flex-1 flex-col input input-bordered"
            placeholder="Title"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          <select
            className="select select-bordered"
            defaultValue=""
            {...register("category")}
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
          />
          <button type="button" className="btn btn-outline">
            Upload image
          </button>
        </div>

        <Controller
          name="content"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <ReactQuill
              theme="snow"
              placeholder="Write something..."
              className="h-72 mb-12"
              {...field}
            />
          )}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
        <button type="submit" className="btn btn-active">
          Publish
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
