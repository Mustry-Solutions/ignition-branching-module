import React from 'react';
import { BranchingComponent } from './client/BranchingComponent';
import './App.css';
import './css/devcss.css'
import './css/main.css';
import { InputType } from './client/types';

const DATA: InputType[] = [
  {
    "color": "#18b918",
    "name": "Are you a horse?",
    "id": 0,
    "nextId": [
      1,
      3,
      15
    ],
    "category": "0",
    "style": {
      "fontFamily": "Comic Sans MS",
      "color": "blue"
    }
  },
  {
    "name": "No",
    "id": 1,
    "nextId": [
      2
    ],
    "category": "1",
    "fill": false
  },
  {
    "color": "#18b918",
    "name": "You are not a horse",
    "id": 2,
    "category": "0",
    "style": {
      "fontFamily": "Comic Sans MS"
    }
  },
  {
    "name": "Maybe",
    "id": 3,
    "nextId": [
      4
    ],
    "fill": false,
    "category": "0"
  },
  {
    "color": "#18b918",
    "name": "How many legs do you walk on?",
    "id": 4,
    "nextId": [
      5,
      6
    ],
    "category": "0"
  },
  {
    "name": "Two",
    "id": 5,
    "nextId": [
      2
    ],
    "fill": false,
    "category": "0"
  },
  {
    "color": "#18b918",
    "name": "Four",
    "id": 6,
    "nextId": [
      7
    ],
    "fill": false,
    "category": "3"
  },
  {
    "color": "#18b918",
    "name": "Really?",
    "id": 7,
    "nextId": [
      8, 9
    ],
    "category": "3"
  },
  {
    "name": "No",
    "id": 8,
    "nextId": [
      2
    ],
    "fill": false,
    "category": "4"
  },
  {
    "color": "#18b918",
    "name": "Yes",
    "id": 9,
    "nextId": [
      10
    ],
    "fill": false,
    "category": "3"
  },
  {
    "color": "#18b918",
    "name": "Can you read and write?",
    "id": 10,
    "nextId": [
      11, 12
    ],
    "category": "3"
  },
  {
    "name": "Yes",
    "id": 11,
    "nextId": [
      2
    ],
    "fill": false,
    "category": "3"
  },
  {
    "color": "#18b918",
    "name": "No",
    "id": 12,
    "nextId": [
      13
    ],
    "fill": false,
    "category": "4"
  },
  {
    "color": "#18b918",
    "name": "Liar! You are lying reading this",
    "id": 13,
    "nextId": [
      14
    ],
    "category": "4"
  },
  {
    "color": "#18b918",
    "name": "yes",
    "id": 14,
    "nextId": [
      2
    ],
    "fill": false,
    "category": "4"
  },
  {
    "color": "#18b918",
    "name": "Yes",
    "id": 15,
    "nextId": [
      4
    ],
    "fill": false,
    "category": "4"
  },
]

function App() {
  return (
    <div className="App">
      <BranchingComponent data={DATA} rootId={0} minXOffset={100} yOffset={100} curveSize={20} />
    </div>
  );
}

export default App;
