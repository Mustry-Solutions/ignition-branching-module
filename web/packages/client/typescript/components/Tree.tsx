import * as React from 'react';
import {
    Component,
    ComponentMeta,
    ComponentProps,
    PComponent,
    PropertyTree,
    SizeObject
} from '@inductiveautomation/perspective-client';

interface TreeProps {
    data: Array<InputType>;
}

interface InputType {
    id: number;
    color: string;
    nextId: Array<number>;
    category: string;
}

interface Node {
    id: number;
    color: string;
    children: Array<number>;
    category: string;
}

interface Dict {
    [id: number]: Node;
}

export class Tree extends Component<ComponentProps<TreeProps>, any> {
    categoryLevels: { [ category: string ]: number } = {};

    convertInput(input: Array<InputType>): Dict {
        return input.reduce((obj, node) => (
            obj[node.id] = { id: node.id, color: node.color, children: node.nextId, category: node.category }, obj
        ), {})
    }

    build(nodes: Dict, root: number) {
        const xOffset: number = 50;
        const yOffset: number = 50;
        let level: number = -1;
    
        let buffer: Array<[ Node, { x: number, y: number }, number ]> = [[nodes[root], {x: 0, y: 0}, -1]];
        let passedNodes: { [id: number]: { id: number, color: string, children: Array<number>, category: string, position: { x: number, y: number }, originId: number } } = {};
        let toPass: Set<number> = new Set();
        let duplicates: Array<[ duplicateId: number, originId: number ]> = [];
        this.categoryLevels[nodes[root].category] = 0;
    
        while (buffer.length > 0) {
            const [node, position, originId] = buffer.shift()!;
    
            for (const childId of node.children) {
                if (toPass.has(childId)) {
                    duplicates.push([childId, node.id]);
                }
                else {
                    if (!this.categoryLevels.hasOwnProperty(nodes[childId].category)) {
                        this.categoryLevels[nodes[childId].category] = this.categoryLevels[node.category] + yOffset * level;
                        level *= -1;
                    }
    
                    buffer.push([
                        nodes[childId],
                        {
                            x: position.x + xOffset,
                            y: this.categoryLevels[nodes[childId].category]
                        },
                        node.id
                    ]);
                    toPass.add(childId);
                }
            }
    
            passedNodes[node.id] = {...node, position, originId}
        }
    
        let output: Array<any> = [];
        let buffer2: Array<number> = [];
    
        for (const [duplicateId, originId] of duplicates) {
            if (passedNodes[originId].position.x >= passedNodes[duplicateId].position.x) {
                let behind = passedNodes[originId].position.x - passedNodes[duplicateId].position.x + xOffset;
                buffer2 = [duplicateId];
                let checked = new Set();
    
                while (buffer2.length > 0) {
                    const nodeId: number = buffer2.shift()!;
                    
                    if (!checked.has(nodeId)) {
                        passedNodes[nodeId].position.x += behind;
                        buffer2.push(...passedNodes[nodeId].children);
    
                        checked.add(nodeId);
                    }
                }
            }
    
            output.push((
                <g id={`dup${originId}-${duplicateId}`} key={`dup${originId}-${duplicateId}`}>
                    <path d={`M ${passedNodes[originId].position.x} ${passedNodes[originId].position.y} L ${passedNodes[duplicateId].position.x} ${passedNodes[duplicateId].position.y}`} stroke='black' />
                </g>
            ));
        }

        let buffer3: Array<{ id: number, color: string, children: Array<number>, category: string, position: { x: number, y: number }, originId: number }> = [ passedNodes[root] ];
        let checked: Set<number> = new Set();
        while (buffer3.length > 0) {
            let node = buffer3.shift()!;

            if (!checked.has(node.id)) {
                output.push((
                    <g id={node.id.toString()} key={node.id}>
                        <g transform={`translate(${node.position.x}, ${node.position.y})`}>
                            <circle r='10' fill={node.color} />
                            <text y='25' x='-5'>{node.id}</text>
                        </g>
                        {node.originId !== -1 &&
                            <path d={`M ${passedNodes[node.originId].position.x} ${passedNodes[node.originId].position.y} L ${node.position.x} ${node.position.y}`} stroke='black' />
                        }
                    </g>
                ));

                for (const childId of node.children) {
                    buffer3.push(passedNodes[childId]);
                }

                checked.add(node.id);
            }
        }

        return output;
    }

    getYOffset() {
        let lowest: number = 0;

        for (const offset of Object.values(this.categoryLevels)) {
            if (offset < lowest) {
                lowest = offset;
            }
        }

        return 50 + (lowest * -1);
    }

    render() {
        const { props: { data }, emit } = this.props;

        return (
            <svg { ...emit() }>
                <g transform={`translate(50, ${this.getYOffset()})`}>
                    { this.build(this.convertInput(data), 0) }
                </g>
            </svg>
        );
    }
}

export const COMPONENT_TYPE = 'trees.display.tree';

export class TreeMeta implements ComponentMeta {
    getComponentType(): string {
        return COMPONENT_TYPE;
    }

    getViewComponent(): PComponent {
        return Tree;
    }

    getDefaultSize(): SizeObject {
        return ({
            width: 500,
            height: 500
        });
    }

    getPropsReducer(propTree: PropertyTree): {} {
        return {
            data: propTree.readArray("data", [])
        };
    }
}
