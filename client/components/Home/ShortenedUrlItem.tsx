import { ShortenedUrl, useEditSlugMutation } from "@/hooks/api/shortener";
import { queryClient } from "@/pages/_app";
import { useEffect, useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
type AxiosError = {
  response: {
    data: {
      message: string;
    };
  };
};
const ShortenedUrlItem = ({
  url,
  onDelete,
}: {
  url: ShortenedUrl;
  onDelete: (slug: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [slug, setSlug] = useState<string>("");
  useEffect(() => {
    setSlug(url.shortened.slice(url.shortened.lastIndexOf("/") + 1));
  }, []);
  const { mutate } = useEditSlugMutation();
  const handleSubmit = () => {
    const currentSlug = url.shortened.slice(url.shortened.lastIndexOf("/") + 1);
    if (currentSlug === slug) return;
    mutate(
      {
        slug: currentSlug,
        newSlug: slug,
      },
      {
        onError: (error) => {
          const err = error as AxiosError;
          alert(err.response.data.message);
        },
        onSuccess: (data) => {
          alert("Success!");
          queryClient.invalidateQueries("urls", { exact: false });
        },
      }
    );
  };
  return (
    <div
      key={url.slug}
      className="flex flex-row justify-between items-center rounded-lg bg-gray-200 my-2 p-2"
    >
      {!isEditing ? (
        <>
          <div className="flex flex-col gap-y-2">
            <a href={url.shortened} className="text-md">
              {url.shortened}
            </a>
            <a className="text-xs text-gray-600">{url.url}</a>
          </div>
          <span className="text-xs">Visited {url.visit_rate} times</span>
          <div className="flex flex-col gap-y-2">
            <button
              className="cursor-pointer"
              onClick={() => onDelete(url.slug)}
            >
              <BsTrash color="red" size={20} />
            </button>

            <button className="cursor-pointer">
              <BsPencil size={20} onClick={() => setIsEditing(true)} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row items-center">
              <div className="text-xs text-gray-600">
                {url.shortened.slice(0, url.shortened.lastIndexOf("/") + 1)}
              </div>
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              ></input>
            </div>
            <div className="flex flex-row gap-x-2">
              <button
                className="btn btn-primary bg-slate-900 text-white p-1 rounded-sm"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary bg-gray-400 text-black p-1 rounded-sm "
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShortenedUrlItem;
