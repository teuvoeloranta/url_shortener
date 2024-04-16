import { ShortenerBody } from "@/hooks/api/shortener";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { SiCodemagic } from "react-icons/si";
import { z } from "zod";

const ShortenerFormSchema = z.object({
  url: z
    .string()
    .min(1, "Required")
    .url("Invalid url - Correct example is http://example.com"),
});
export type ShortenerFormSchema = z.infer<typeof ShortenerFormSchema>;

const ShortenerForm = ({
  onSubmit,
  isLoading,
  onError,
}: {
  onSubmit: (body: ShortenerFormSchema) => void;
  onError: () => void;
  isLoading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShortenerFormSchema>({
    resolver: zodResolver(ShortenerFormSchema),
    reValidateMode: "onChange",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col items-center self-center w-full"
    >
      <div className="flex flex-col relative w-full">
        <input
          disabled={isLoading}
          className="bg-slate-50/50 disabled:brightness-90 disabled:opacity-65 focus:bg-slate-50 border border-slate-200 shadow-black/10 focus:shadow-xl transition-all duration-300 rounded-full px-5 py-3.5"
          placeholder="http://example.com"
          {...register("url")}
        />

        {errors.url && (
          <p className="absolute top-full mt-2 px-3 text-xs text-red-400">
            {errors.url.message}
          </p>
        )}
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="btn btn-primary bg-slate-900 hover: text-white px-4 py-3 rounded-lg mt-6 flex items-center gap-2"
      >
        <SiCodemagic
          className={classNames("text-white", isLoading ? "animate-spin" : "")}
        />
        <span>Get Shortened</span>
      </button>
    </form>
  );
};

export default ShortenerForm;
