import { useShortenerMutation } from "@/hooks/api/shortener";
import ShortenerForm, { ShortenerFormSchema } from "./ShortenerForm";
import Result from "./Result";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MyShortenedUrls from "./MyShortenedUrls";
import { queryClient } from "../../pages/_app";

const HomePage = () => {
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const { data, mutate, isLoading } = useShortenerMutation();

  const onSubmit = (body: ShortenerFormSchema) => {
    setIsFormError(false);
    mutate(
      {
        ...body,
        userId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("urls", { exact: false });
        },
      }
    );
  };
  useEffect(() => {
    let uuid = localStorage.getItem("userId");
    if (!uuid) {
      uuid = uuidv4();
      localStorage.setItem("userId", uuid);
    }
    setUserId(uuid);
  }, []);
  return (
    <div className="h-full w-full max-w-[640px] p-4 sm:p-6 flex flex-col gap-y-4 mx-auto">
      {!!data && <Result shortened={data} isFormError={isFormError} />}
      <ShortenerForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        onError={() => setIsFormError(true)}
      />
      {!!userId && <MyShortenedUrls userId={userId} />}
    </div>
  );
};

export default HomePage;
