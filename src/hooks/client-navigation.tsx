"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export interface QueryParamsItem {
  name: string;
  value: string;
}

export default function ClientNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParamsUrl = useCallback(() => {
    return new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  const createQueryString = useCallback((data: QueryParamsItem[]) => {
    const params = new URLSearchParams();
    data.forEach(({ name, value }) => {
      params.set(name, value);
    });
    return params.toString();
  }, []);

  const reloadPage = useCallback(() => {
    router.refresh();
  }, [router]);

  const goToPage = useCallback(
    (pathname: string, query?: string) => {
      const url = query ? `${pathname}?${query}` : pathname;
      router.push(url);
    },
    [router],
  );

  return {
    getParamsUrl,
    createQueryString,
    reloadPage,
    pathname,
    goToPage,
  };
}
