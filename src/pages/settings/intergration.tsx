import React, { useEffect } from "react";
import { Typography } from "antd";

import Rolecheck from "../../components/role-check";

const Intergration: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://zapier.com/apps/embed/widget.js?services=trello&html_id=zapier-bg";
    script.async = true;

    const bg = document.getElementById("zapier-bg");
    if (bg) {
      bg.appendChild(script);
    }
  }, []);

  return (
    <Rolecheck module="Integration" fullpage>
      <Typography.Title level={3}>Zapier Intergration</Typography.Title>
      <div id="zapier-bg"></div>
    </Rolecheck>
  );
};

export default Intergration;
