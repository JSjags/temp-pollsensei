"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { useEffect, useState } from "react";

export const TanstackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [queryClient] = useState(
  //   new QueryClient({
  //     defaultOptions: {
  //       queries: {
  //         staleTime: 180_000, //number in milliseconds equals to 5 minutes,

  //         // gcTime: 0,
  //         // refetchOnWindowFocus: false,
  //         // refetchOnMount: false,
  //         // refetchOnReconnect: false,
  //         // retry: 2,
  //       },
  //     },
  //   })
  // );
  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // if (!isMounted) {
  //   return null;
  // }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 180_000, //number in milliseconds equals to 5 minutes,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* {isMounted && <ReactQueryDevtools initialIsOpen={false} />} */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
