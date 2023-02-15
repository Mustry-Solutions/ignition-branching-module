import React from 'react';
import Tree, { InputType } from './client/Tree';
import './App.css'

const DATA: InputType[] = [
  {
    "color": "#18b918",
    "id": 0,
    "nextId": [
      1,
      4,
      7,
      13
    ],
    "category": "0",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "id": 1,
    "nextId": [
      2
    ],
    "category": "1",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "id": 2,
    "nextId": [
      3
    ],
    "category": "1",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "id": 3,
    "nextId": [
      9
    ],
    "category": "1",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "id": 9,
    "nextId": [
      10
    ],
    "category": "0",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "id": 10,
    "nextId": [
      11
    ],
    "category": "0",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "id": 4,
    "nextId": [
      5
    ],
    "category": "2",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "id": 5,
    "nextId": [
      6
    ],
    "category": "2",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "id": 6,
    "nextId": [
      9
    ],
    "category": "2",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "id": 7,
    "nextId": [
      8
    ],
    "category": "0",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "id": 8,
    "nextId": [
      9
    ],
    "category": "0",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "id": 12,
    "nextId": [
      9
    ],
    "category": "4",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "id": 13,
    "nextId": [
      14
    ],
    "category": "5",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "id": 14,
    "nextId": [
      10
    ],
    "category": "5",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "id": 11,
    "nextId": [],
    "category": "0",
    "fill": false
  }
]

function App() {
  return (
    <div className="App">
      <Tree data={DATA} rootId={0} />
    </div>
  );
}

export default App;
