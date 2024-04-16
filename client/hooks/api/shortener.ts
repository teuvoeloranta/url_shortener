import axiosI from "@/utils/axiosI";
import { useMutation, useQuery } from "react-query";

export const useShortenerMutation = () =>
  useMutation((body: ShortenerBody) =>
    axiosI.post<ShortenedResponse>("/add", body).then((res) => res.data)
  );

export const useDeleteUrlMutation = () =>
  useMutation((slug: string) =>
    axiosI.delete<ShortenedResponse>(`/${slug}`).then((res) => res.data)
  );
  export const useEditSlugMutation = () =>
    useMutation(({slug, newSlug}:{
      slug: string,
      newSlug: string
    }) =>
      axiosI.post<ShortenedResponse>(`/${slug}`, {newSlug}).then((res) => res.data)
    );

export const useGetUrlBySlug = ({
  slug,
  enabled,
}: {
  slug: string;
  enabled: boolean;
}) => {
  return useQuery(
    ["url", slug],
    () => axiosI.get<ShortenedUrl>(`/${slug}`).then((res) => res.data),
    { enabled, retry: 0 }
  );
};

export const useGetUrlsByUserId = (userId: string) => {
  return useQuery(["urls", userId], () =>
    axiosI.get<ShortenedUrl[]>(`/user/${userId}`).then((res) => res.data)
  );
};
export type ShortenerBody = {
  url: string;
  userId: string;
};
export type ShortenedResponse = {
  url: string;
  userId: string;
};

export type ShortenedUrl = {
  url: string;
  slug: string;
  visit_rate: number;
  userId: string;
  shortened: string;
};


export type EditSlugBody = {
  newSlug: string;
};