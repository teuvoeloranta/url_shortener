import { ShortenedResponse, ShortenedUrl } from "@/hooks/api/shortener";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { BiSolidCopy } from "react-icons/bi";

const Result = ({
  shortened,
  isFormError,
}: {
  shortened: ShortenedResponse | undefined;
  isFormError: boolean;
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyEffect = (textToCopy: string) => {
    if (!isCopied) {
      setIsCopied(true);
      navigator.clipboard.writeText(textToCopy);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timeOut = setTimeout(() => {
        setIsCopied(false);
      }, 10000);

      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [isCopied]);

  useEffect(() => {
    setIsCopied(false);
  }, [shortened]);

  return (
    <div className="self-center w-full">
      {!isFormError && shortened && (
        <>
          <p className="text-sm px-4">Shortened:</p>
          <button
            onClick={() => handleCopyEffect(shortened.url)}
            className={classNames(
              "group px-4 mt-2 sm:px-8 py-6 rounded-xl border w-full  flex gap-2 items-center justify-between transition-all duration-200 cursor-default",
              isCopied
                ? "bg-[#d4f7f0] border-[#067a6e]/40"
                : "border-slate-200 bg-gray-300/10 cursor-pointer hover:border-[#067a6e]/40"
            )}
          >
            <p
              className={classNames(
                "text-sm sm:text-base",
                isCopied ? "text-[#067a6e]" : ""
              )}
            >
              {shortened.url}
            </p>
            <div
              className={classNames(
                "flex items-center gap-1",
                isCopied ? "text-[#067a6e]" : "group-hover:text-[#067a6e]"
              )}
            >
              {!isCopied && (
                <span className="text-xs hidden group-hover:inline">Copy</span>
              )}
              {isCopied && <span className="text-xs">Copied</span>}
              <BiSolidCopy size={20} />
            </div>
          </button>
        </>
      )}
    </div>
  );
};

export default Result;
