import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const IsNotCEO: React.FC = props => {
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [isNotCEO, setisNotCEO] = useState(true);
  useEffect(() => {
    if (state?.user?.is_ceo) {
      setisNotCEO(false);
    }
  }, [state]);
  return <>{isNotCEO && props.children}</>;
};

export default IsNotCEO;
