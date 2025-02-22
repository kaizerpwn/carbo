import React from "react";

interface HelloProps {
  name: string;
}

const Hello: React.FC<HelloProps> = ({ name }) => {
  return <div>Hello, {name}!</div>;
};

export default Hello;
