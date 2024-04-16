import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useGetUrlBySlug } from "@/hooks/api/shortener";
import Link from "next/link";

const SlugPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: shortenedData, error } = useGetUrlBySlug({
    slug: slug as string,
    enabled: !!slug && !errorMessage,
  });
  useEffect(() => {
    if (shortenedData) {
      setLoading(false);
      setTimeout(() => {
        window.location.replace(shortenedData.url);
      }, 5000);
    }
  }, [shortenedData]);
  useEffect(() => {
    if (error) {
      setLoading(false);
      setErrorMessage("Url not found!");
    }
  }, [error]);

  return (
    <div className="h-full w-full max-w-[640px] p-4 sm:p-6 mx-auto flex items-center justify-center text-xl">
      {!!loading && <div>Loading...</div>}
      {!!shortenedData && (
        <div className="flex flex-col items-center gap-y-4">
          <div>Redirecting to {shortenedData.url} ...</div>
          <div>This url is visited {shortenedData.visit_rate} times </div>
        </div>
      )}
      {!!errorMessage && (
        <div className="flex flex-col gap-y-4 items-center">
          <div>{errorMessage}</div>
          <Link
            href="/"
            className="btn btn-primary bg-slate-900 hover: text-white px-4 py-3 rounded-lg"
          >
            <span>Got to Homepage</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SlugPage;
