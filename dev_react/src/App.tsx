import React from "react";
import { BranchingComponent } from "./client/BranchingComponent/BranchingComponent";
import "./App.css";
import "./css/devcss.css";
import "./css/main.css";
import { InputType } from "./client/types";

const DATA0: InputType[] = [
  {
    name: "node1",
    id: 0,
    nextId: [2, 3, 6],
    fill: false,
    category: 0,
  },
  {
    nextId: [4],
    name: "node2",
    id: 2,
    category: 0,
    fill: false,
  },
  {
    nextId: [5],
    color: "#ff0000",
    name: "node3",
    id: 3,
    category: 3,
    fill: false,
  },
  {
    nextId: [5],
    color: "#ff0000",
    name: "node6",
    id: 6,
    category: 2,
    fill: false,
  },
  {
    nextId: [5],
    name: "node4",
    id: 4,
    category: 0,
    fill: false,
  },
  {
    nextId: [],
    name: "node5",
    id: 5,
    category: 0,
    fill: false,
  },
];

const DATA1: InputType[] = [
  {
    name: "node1",
    id: 0,
    nextId: [2, 3],
    fill: false,
    category: 0,
  },
  {
    nextId: [5],
    name: "node2",
    id: 2,
    category: 0,
    fill: false,
  },
  {
    nextId: [4, 5],
    color: "#ff0000",
    name: "node3",
    id: 3,
    category: 2,
    fill: false,
  },
  {
    nextId: [5],
    name: "node4",
    id: 4,
    category: 2,
    fill: false,
  },
  {
    nextId: [],
    name: "node5",
    id: 5,
    category: 0,
    fill: false,
  },
];

const DATA3: InputType[] = [
  {
    color: "#18b918",
    name: "Are you a horse?",
    id: 0,
    nextId: [1, 3, 15],
    category: 0,
    style: {
      fontFamily: "Comic Sans MS",
      color: "blue",
    },
  },
  {
    name: "No",
    id: 1,
    nextId: [2],
    category: 1,
    fill: false,
  },
  {
    color: "#18b918",
    name: "You are not a horse",
    id: 2,
    category: 0,
    style: {
      fontFamily: "Comic Sans MS",
    },
  },
  {
    name: "Maybe",
    id: 3,
    nextId: [4],
    fill: false,
    category: 0,
  },
  {
    color: "#18b918",
    name: "How many legs do you walk on?",
    id: 4,
    nextId: [5, 6],
    category: 0,
  },
  {
    name: "Two",
    id: 5,
    nextId: [2],
    fill: false,
    category: 0,
  },
  {
    color: "#18b918",
    name: "Four",
    id: 6,
    nextId: [7],
    fill: false,
    category: 3,
  },
  {
    color: "#18b918",
    name: "Really?",
    id: 7,
    nextId: [8, 9],
    category: 3,
  },
  {
    name: "No",
    id: 8,
    nextId: [2],
    fill: false,
    category: 4,
  },
  {
    color: "#18b918",
    name: "Yes",
    id: 9,
    nextId: [10],
    fill: false,
    category: 3,
  },
  {
    color: "#18b918",
    name: "Can you read and write?",
    id: 10,
    nextId: [11, 12],
    category: 3,
  },
  {
    name: "Yes",
    id: 11,
    nextId: [2],
    fill: false,
    category: 3,
  },
  {
    color: "#18b918",
    name: "No",
    id: 12,
    nextId: [13],
    fill: false,
    category: 4,
  },
  {
    color: "#18b918",
    name: "Liar! You are lying reading this",
    id: 13,
    nextId: [14],
    category: 4,
  },
  {
    color: "#18b918",
    name: "yes",
    id: 14,
    nextId: [2],
    fill: false,
    category: 4,
  },
  {
    color: "#18b918",
    name: "Yes",
    id: 15,
    nextId: [4],
    fill: false,
    category: 4,
  },
];

function App() {
  return (
    <div className="App">
      <div
        style={{
          position: "relative",
          top: "20px",
        }}
      >
        <h1>Example 1</h1>
        <BranchingComponent
          data={DATA0}
          rootId={0}
          minXOffset={100}
          yOffset={100}
          curveSize={20}
        />
      </div>
      <div
        style={{
          position: "relative",
          top: "300px",
        }}
      >
        <h1>Example 2</h1>
        <BranchingComponent
          data={DATA1}
          rootId={0}
          minXOffset={100}
          yOffset={100}
          curveSize={20}
        />
      </div>
      <div
        style={{
          position: "relative",
          top: "600px",
        }}
      >
        <h1>Example 3</h1>
        <BranchingComponent
          data={DATA3}
          rootId={0}
          minXOffset={100}
          yOffset={100}
          curveSize={20}
        />{" "}
      </div>
    </div>
  );
}

export default App;
