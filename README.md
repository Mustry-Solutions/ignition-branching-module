# Mustry UI Module

This module is a compilation of modules made by Mustry Solutions.

## Contents
- Branching Component

## Branching Component

The branching component is made to display a tree like structure. Such like a tree of tasks. it's input is a simple array of nodes linked to each other.

```JSON
[
    {
        "color": "#ffffff",
        "name": "node name",
        "id": 0,
        "nextId": [
            1,
            4,
            7,
            13
        ],
        "category": "0",
        "fill": true
    }
]
```

The category field will put all nodes of the same category on the same level (y coordinate).
