"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWebsitePageDetails, getWebsitePageList, type ListParams } from "@/api/websitePage";
import { WEBSITE_PAGE_DETAILS, WEBSITE_PAGE_LIST } from "@/constants/api-endpoints";

// List of pages of one type, e.g. useWebsitePageList("event", { page: 1, limit: 10 })
// Call refetchWithQuery({ page: 2, limit: 10 }) to load another page / search.
export const useWebsitePageList = <D = Record<string, unknown>>(
  type: string,
  qData: ListParams = { page: 1, limit: 20 },
  options = {}
) => {
  const [queryParams, setQueryParams] = useState<ListParams>({ ...qData });

  const queryResult = useQuery({
    queryKey: [WEBSITE_PAGE_LIST(type), queryParams],
    queryFn: async () => (await getWebsitePageList<D>(type, queryParams)).data,
    select: (res) => ({
      data: res.data,
      extra: res.extra,
      qData: queryParams,
    }),
    ...options,
  });

  return {
    ...queryResult,
    refetchWithQuery: (params: ListParams) => setQueryParams({ ...params }),
  };
};

// One page by slug, e.g. useWebsitePageDetails("policy-discussion", slug)
export const useWebsitePageDetails = <D = Record<string, unknown>>(
  type: string,
  slug?: string,
  options = {}
) =>
  useQuery({
    queryKey: [WEBSITE_PAGE_DETAILS(type, slug || "")],
    queryFn: async () => (await getWebsitePageDetails<D>(type, slug as string)).data,
    select: (res) => res.data,
    enabled: !!slug,
    ...options,
  });
