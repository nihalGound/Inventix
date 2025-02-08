import React from "react";
import { Spinner } from "./Spinner";

type Props = {
  state: boolean;
  children: React.ReactNode;
};

function Loader({ state, children }: Props) {
  if (state) return <Spinner />;
  return children;
}

export default Loader;
