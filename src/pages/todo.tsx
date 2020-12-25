import React, { useState } from "react";
import { Col, Input, Row, message } from "antd";
import { List } from "antd";

import RootPage from "./root";

const Todo: React.FC = (props: any) => {
  const [TodoList, setTodoList] = useState([]);
  const [InputValue, setInputValue] = useState("");
  const addTodo = () => {
    const newTodos: any = [...TodoList];
    newTodos.push(InputValue);
    //@ts-ignore
    window.sockets.emit("add-todo", InputValue);
    setInputValue("");
  };
  //@ts-ignore
  window.sockets.on("new-todo", function(data) {
    const newTodos: any = [...data];
    setTodoList(newTodos);
  });

  //@ts-ignore
  window.sockets.on("news", data => {
    message.info(data.hello);
  });

  return (
    <RootPage>
      <Row>
        <Col span={10}>
          <List>
            {TodoList.map(item => (
              <List.Item key={item + Math.random()}>{item}</List.Item>
            ))}
          </List>
          <Input
            onPressEnter={addTodo}
            value={InputValue}
            onChange={e => {
              setInputValue(e.target.value);
            }}
          />
        </Col>
      </Row>
      hello
    </RootPage>
  );
};

export default Todo;
