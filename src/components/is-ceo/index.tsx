import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const IsCEO: React.FC = props => {
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [isCEO, setisCEO] = useState(false);
  useEffect(() => {
    if (state?.user?.is_ceo) {
      setisCEO(true);
    }
  }, [state]);
  return <>{isCEO && props.children}</>;
};

export default IsCEO;
