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
    nextId: [2],
    fill: false,
    category: 0,
    tooltip: `
  # Node 1 Info
  ## Node 1 Subtitle
  This is the first node. It is connected to 
  - Node 2
  - Node 3
  - Node 6
  `,
  },
  {
    nextId: [4],
    name: "node2",
    id: 2,
    category: 0,
    fill: false,
    tooltip: `
  ## Node 2 Info`,
  },
  // {
  //   nextId: [5],
  //   color: "#ff0000",
  //   name: "node3",
  //   id: 3,
  //   category: 3,
  //   fill: false,
  //   tooltip: `**Simple text**`,
  // },
  // {
  //   nextId: [5],
  //   color: "#ff0000",
  //   name: "node6",
  //   id: 6,
  //   category: 2,
  //   fill: false,
  //   tooltip: `# Veeeeeery loooooonng teeeeexxxt`,
  // },
  {
    nextId: [5],
    name: "node4",
    id: 4,
    category: 0,
    fill: false,
    tooltip: `# Node 4 Info
---
## Node 4 Subtitle
This is only connected to **Node 5**`,
  },
  {
    nextId: [],
    name: "node5",
    id: 5,
    category: 0,
    fill: false,
    tooltip: `
Here is a code block with JSON inside:

\`\`\`json
{
  "a": "b",
  "c": "c"
}
\`\`\`
`,
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
    tooltip: "Answer for this question even if you have two legs",
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
    tooltip: `Having problems with the definition`,
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

const DATA4 = [
  {
    nextId: [10, 5, 3, 13, 11, 8],
    color: "#000080",
    isRoot: true,
    name: "Klaar voor productie",
    id: 20,
    fill: true,
    category: -10,
  },
  {
    nextId: [4],
    color: "#000080",
    isRoot: false,
    name: "Rolluiken-montage kast",
    id: 6,
    fill: true,
    category: -10,
  },
  {
    nextId: [7],
    name: "Rolluiken-sluiten kast",
    id: 2,
    category: 0,
  },
  {
    nextId: [1],

    name: "Productie klaar",
    id: 7,
    category: 0,
  },
  {
    nextId: [],
    name: "Inpak",
    id: 1,
    category: 0,
  },
  {
    nextId: [6],
    color: "#000080",
    isRoot: false,
    name: "Rolluiken-voormontage",
    id: 3,
    fill: true,
    category: 0,
  },
  {
    nextId: [2],
    color: "#000080",
    isRoot: false,
    name: "Rolluiken-montage pantser",
    id: 4,
    fill: true,
    category: 0,
  },
  {
    nextId: [4],
    color: "#000080",
    isRoot: false,
    name: "Rolluiken-controle geleiders",
    id: 5,
    fill: true,
    category: -40,
  },

  {
    nextId: [9],
    color: "#000080",
    isRoot: false,
    name: "Rolluiken-zagen as",
    id: 8,
    fill: false,
    category: -10,
  },
  {
    nextId: [6],
    color: "#000080",
    isRoot: false,
    name: "Rolluiken-montage motor",
    id: 9,
    fill: false,
    category: -10,
  },
  {
    nextId: [4],
    color: "#000080",
    isRoot: false,
    name: "Rolluiken Dallan",
    id: 10,
    fill: true,
    category: 10,
  },
  {
    nextId: [6],
    color: "#000080",
    isRoot: false,
    name: "Zagen standaard kleur",
    id: 11,
    fill: true,
    category: -20,
  },
  {
    nextId: [4],
    color: "#000080",
    isRoot: false,
    name: "Rolluiken-klaarmaken onderlat",
    id: 12,
    fill: true,
    category: 20,
  },
  {
    nextId: [12, 14],
    color: "#000080",
    isRoot: false,
    name: "Rolluiken-zagen pantser",
    id: 13,
    fill: false,
    category: 20,
  },
  {
    nextId: [4],
    color: "#000080",
    isRoot: false,
    name: "Rolluiken-arreteren",
    id: 14,
    fill: false,
    category: 30,
  },
];
const DATA5 = [
  {
    name: "node1",
    id: 0,
    nextId: [2],
    category: 0,
  },
  {
    nextId: [4],
    name: "node2",
    id: 2,
    category: 0,
  },
  {
    nextId: [],
    name: "node4",
    id: 4,
    category: 0,
  },
];

const DATA6 = [
  {
    name: "Rolluiken-sluiten kast",
    id: 0,

    nextId: [2],
    category: 0,
  },
  {
    name: "Productie klaar",
    id: 2,
    nextId: [1],

    category: 0,
  },
  {
    name: "Inpak",
    id: 1,

    nextId: [],
    category: 0,
  },
];

function findRootsWithOutgoingOnly(nodes: InputType[]): number {
  const referencedIds = new Set(nodes.flatMap((node) => node.nextId ?? []));

  const roots = nodes
    .filter((node) => {
      const hasOutgoing = (node.nextId ?? []).length > 0;
      const isNotReferenced = !referencedIds.has(node.id);
      return hasOutgoing && isNotReferenced;
    })
    .map((node) => node.id);

  return roots[0];
}
function App() {
  return (
    <div className="App">
      <div
      // style={{
      //   position: "relative",
      //   top: "600px",
      // }}
      >
        <h1>Example 1</h1>
        <BranchingComponent
          data={DATA0}
          minXOffset={100}
          yOffset={100}
          curveSize={20}
        />
      </div>
      <div
      // style={{
      //   position: "relative",
      //   top: "300px",
      // }}
      >
        <h1>Example 2</h1>
        <BranchingComponent
          data={DATA1}
          minXOffset={100}
          yOffset={100}
          curveSize={20}
        />
      </div>
      <div
      // style={{
      //   position: "relative",
      //   top: "00px",
      // }}
      >
        <h1>Example 3</h1>
        <BranchingComponent
          data={DATA3}
          minXOffset={100}
          yOffset={100}
          curveSize={20}
        />{" "}
      </div>
      <div
      // style={{
      //   position: "relative",
      //   top: "00px",
      // }}
      >
        <h1>Example 3</h1>
        <BranchingComponent
          data={DATA4}
          minXOffset={100}
          yOffset={100}
          curveSize={20}
        />{" "}
      </div>
    </div>
  );
}

export default App;
