import React from "react";
import { Tag } from "antd";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const Random: React.FC = () => {
  const color = getRandomColor();
  return <Tag color={color}>{color}</Tag>;
};

export default Random;
