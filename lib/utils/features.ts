// utils/features.ts
import { toast } from "react-hot-toast";
import { NextRouter } from "next/router";
import qs from 'query-string';

export const responseToast = (res: any, router: NextRouter, path: string) => {
  if ('data' in res && res.data.success) {
    toast.success(res.data.message);
    router.push(path);
  } else {
    toast.error(res.error?.data?.message || "Something went wrong");
  }
};

export const slugify = (title: string) => {
  return title
    .toLowerCase() // Convert to lowercase
    .replace(/ /g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, ""); // Remove any non-alphanumeric characters except hyphens
};

export const unSlugify = (slug: string) => {
  return slug
  .replace(/-/g, " ")    // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char); // Capitalize the first letter of each word
};


export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
}
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

