import { Context, useContext } from "react";

export default function useMeaningfulContext<T>(
  context: Context<T | undefined>
) {
  const contextValue = useContext(context);

  if (!contextValue) {
    throw new Error(
      "useMeaningfulContext must be used within a Provider with a value"
    );
  }

  return contextValue;
}