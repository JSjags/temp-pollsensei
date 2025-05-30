"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";

type Props = {
  children: ReactNode;
};

const ReduxContext = ({ children }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
};

export default dynamic(() => Promise.resolve(ReduxContext), { ssr: false });
