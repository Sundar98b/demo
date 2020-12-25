import Icon from "@ant-design/icons";
import React from "react";

const SortAlphAscSVG = () => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 500 500"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M106.23 0H75.86L1.49597 212.467H43.769L54.941 180.547H126.311L137.323 212.467H179.53L106.23 0ZM68.906 140.647L90.882 77.856L112.546 140.647H68.906Z"
        fill="currentColor"
      />
      <path
        d="M483.288 359.814L407.478 435.624V0H367.578V435.624L291.768 359.814L263.555 388.027L387.528 512L511.501 388.027L483.288 359.814Z"
        fill="currentColor"
      />
      <path
        d="M182.043 299.247H0.499023V339.147H122.039L0.499023 480.372V511.717H180.048V471.817H60.503L182.043 330.592V299.247Z"
        fill="currentColor"
      />
    </svg>
  );
};

const SortAlphAsc = (props: any) => (
  <Icon component={SortAlphAscSVG} {...props} />
);

export { SortAlphAsc };
