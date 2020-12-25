import { useEffect } from "react";
import { debounce } from "lodash-es";

const useResizeObserver = (callback: Function) => {
  useEffect(() => {
    const handleResize = debounce(() => callback(), 500);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [callback]);
};

export default useResizeObserver;
