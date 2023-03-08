import React from 'react';
import { Tree } from './client/Tree';
import './App.css';
import './css/reset.css'
import './css/main.css';
import { InputType } from './client/types';

const DATA: InputType[] = [
  {
    "color": "#18b918",
    "name": "Zagen",
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
    "name": "Zagen",
    "id": 1,
    "nextId": [
      2
    ],
    "category": "1",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 2,
    "nextId": [
      3
    ],
    "category": "1",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 3,
    "nextId": [
      9
    ],
    "category": "1",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 9,
    "nextId": [
      10
    ],
    "category": "0",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 10,
    "nextId": [
      11
    ],
    "category": "0",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 4,
    "nextId": [
      5
    ],
    "category": "2",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 5,
    "nextId": [
      6
    ],
    "category": "2",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 6,
    "nextId": [
      9
    ],
    "category": "2",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 7,
    "nextId": [
      8
    ],
    "category": "0",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 8,
    "nextId": [
      9
    ],
    "category": "0",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 12,
    "nextId": [
      9
    ],
    "category": "4",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 13,
    "nextId": [
      14
    ],
    "category": "5",
    "fill": true
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 14,
    "nextId": [
      10
    ],
    "category": "5",
    "fill": false
  },
  {
    "color": "#0A0D27",
    "name": "Zagen",
    "id": 11,
    "nextId": [],
    "category": "0",
    "fill": false
  }
]

function App() {
  return (
    <div className="App">
      <Tree data={DATA} rootId={0} minXOffset={100} yOffset={100} curveSize={20} lineWidth={2} backgroundColor={'#fafafa'} nodeSize={20} />
    </div>
  );
}

export default App;
