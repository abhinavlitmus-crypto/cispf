import { WEBSITE_PAGE_DETAILS, WEBSITE_PAGE_LIST } from "@/constants/api-endpoints";
import axiosInstance from "@/lib/axios";

// Shape returned by every API endpoint
export type ApiResponse<T, E = unknown> = {
  data: T;
  message: string;
  code: number;
  extra?: E;
};

export type Pagination = { page: number; limit: number; total: number };

export type WebsitePage<D = Record<string, unknown>> = {
  _id: string;
  type: string;
  details: D;
  status: boolean;
  updatedAt?: string;
};

export type ListParams = { page?: number; limit?: number; key?: string; isAll?: boolean };

export async function getWebsitePageList<D>(type: string, params?: ListParams) {
  return axiosInstance.get<ApiResponse<WebsitePage<D>[], Pagination>>(WEBSITE_PAGE_LIST(type), { params });
}

export async function getWebsitePageDetails<D>(type: string, slug: string) {
  return axiosInstance.get<ApiResponse<WebsitePage<D> | null>>(WEBSITE_PAGE_DETAILS(type, slug));
}
