# Mustry UI Module

This module is a compilation of components made by Mustry Solutions. It's open source and free to use. In Perspective, you'll have this as a result:

![image](https://github.com/user-attachments/assets/41f57f43-b12e-4dfa-8aa7-db0f7995ec4e)


## Contents

- Branching Component

## Branching Component

The branching component is made to display a tree structure horizontally. Displaying tree structures means that the data needs to have 1 node as a starting point, called the root of the tree. Secondly all nodes need to be connected meaning that a path must be available to a node or it won't be displayed.

The component has the following properties which can be adjusted in Ignition.

```JSON5
"properties": {
    "rootId": 0, // entry point for tree
    "data": [], // data used to build the tree view
    "minXOffset": 50, // the minimum horizontal offset of the nodes in pixels
    "yOffset": 50, // the vertical offset of nodes in pixels
    "lineWidth": 2, // the width of the line connecting the nodes in pixels --optional
    "connectionColor": "black", // the default color of the connection between nodes (can be overwritten by node color using colorOutgoing) --optional
    "backgroundColor": "white", // the background color of the component, used because the nodes draw over the node connections --optional
    "curveSize": 10, // the size of the curve, must be smaller or equal to half the x and half y offset --optional
    "nodeSize": 20 // width and height of 1 node in pixels --optional
}
```

The data is filled by nodes which can be tweaked individually. The most important properties are the id, used to identify a node. The category is important to tell the program what nodes should be displayed on the same level. And the nextId contains the id's of the nodes to draw a path to.

```JSON5
[
    {
        "color": "#ffffff", // color of the node --optional
        "colorOutgoing": true, // if true the paths starting from this node will also have the color defined in color --optional
        "name": "node display name", // displays this text under the node --optional
        "id": 0,
        "nextId": [ // will draw path from this node to these node (The ID's have to exist!) --optional
            1,
            3,
            15
        ],
        "category": 0, // all nodes with the same category will be drawn on the same level (y coordinate), higher number => lower level
        "icon": { // can be from the material library or any icon library imported in Ignition --optional
            "path": "material/check",
            "color": "blue"
        },
        "style": { // specific css for this node can be added --optional
            "fontFamily": "Comic Sans MS",
            "color": "blue"
        }
    },
    ...
]
```

