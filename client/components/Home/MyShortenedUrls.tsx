import {
  useDeleteUrlMutation,
  useGetUrlsByUserId,
} from "@/hooks/api/shortener";
import { BsTrash } from "react-icons/bs";
import ShortenedUrlItem from "./ShortenedUrlItem";
import { queryClient } from "@/pages/_app";
const MyShortenedUrls = ({ userId }: { userId: string }) => {
  const { data: urls } = useGetUrlsByUserId(userId);
  const { mutate: deleteMutation } = useDeleteUrlMutation();
  const onDelete = (slug: string) => {
    deleteMutation(slug, {
      onSuccess: () => {
        queryClient.invalidateQueries("urls", { exact: false });
      },
    });
  };
  return (
    <div className="self-center w-full flex flex-col gap-y-2">
      {!!urls?.length && (
        <>
          <h2>My Shortened Urls:</h2>
          <div className="max-h-[500px] overflow-auto">
            {urls.map((url) => (
              <ShortenedUrlItem onDelete={onDelete} key={url.slug} url={url} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyShortenedUrls;
