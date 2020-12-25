import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const IsUser: React.FC = props => {
  const state = useSelector((state: any) => state.INITIAL_DATA);
  const [IsUser, setIsUser] = useState(true);
  useEffect(() => {
    if (state?.user?.is_manager || state?.user?.is_manager) {
      setIsUser(false);
    }
  }, [state]);
  return <>{IsUser && props.children}</>;
};

export default IsUser;
