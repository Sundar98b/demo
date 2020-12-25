import React from "react";

export const useTimeout = (callback: Function, delay: number) => {
  const timeoutRef: any = React.useRef();
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the timeout:

  React.useEffect(() => {
    if (typeof delay === "number") {
      timeoutRef.current = window.setTimeout(
        () => callbackRef.current(),
        delay,
      );

      // Clear timeout if the components is unmounted or the delay changes:
      return () => window.clearTimeout(timeoutRef.current);
    }
  }, [delay]);

  // In case you want to manually clear the timeout from the consuming component...:
  return timeoutRef;
};
