import React from "react";
import faker from "faker";

import Bullet from "../../components/bullet";

const Leaderboard: React.FC = () => {
  const data = [];

  for (let index = 0; index < 10; index++) {
    data.push({
      name: faker.name.findName(),
      pic: faker.image.avatar(),
      progress: faker.random.number(120),
    });
  }

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Leaderboard</h3>
      {data.map(item => (
        <Bullet
          prefix={true}
          span={1}
          title={
            <img
              src={item.pic}
              alt="Profile"
              height="20"
              width="20"
              style={{ borderRadius: "50%" }}
            />
          }
          progress={item.progress}
        />
      ))}
    </div>
  );
};

export default Leaderboard;
