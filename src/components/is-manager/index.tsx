import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const IsManager: React.FC = props => {
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [IsManager, setIsManager] = useState(false);
  useEffect(() => {
    if (state?.user?.is_manager) {
      setIsManager(true);
    }
  }, [state]);
  return <>{IsManager && props.children}</>;
};

export default IsManager;
