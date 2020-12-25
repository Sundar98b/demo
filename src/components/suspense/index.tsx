import React from "react";
import { Skeleton } from "antd";

import RootPage from "../../pages/root";

const SuspenseFallback = () => {
  return (
    <>
      <RootPage>
        <Skeleton active />
      </RootPage>
    </>
  );
};

export default SuspenseFallback;
