import * as React from 'react';
import {
    Component,
    ComponentMeta,
    ComponentProps,
    PComponent,
    PropertyTree,
    SizeObject
} from '@inductiveautomation/perspective-client';

interface InputType {
    id: number;
    color: string;
    nextId: Array<number>;
    category: string;
    fill: boolean;
}

interface Node {
    id: number;
    color: string;
    children: Array<number>;
    category: string;
    fill: boolean;
}

interface Dict {
    [id: number]: Node;
}

interface TreeProps {
    data: InputType[];
    rootId: number;
}

interface TreeState {
    categoryLevels: { [ category: string ]: number };
    yOffset: number;
    pathsRender: React.ReactElement<any, any>[];
    nodesRender: React.ReactElement<any, any>[];
}

export class Tree extends Component<ComponentProps<TreeProps>, TreeState> {
    constructor(props: ComponentProps<TreeProps>) {
        super(props);
        this.state = {
            categoryLevels: {},
            yOffset: 50,
            pathsRender: [],
            nodesRender: []
        }
    }

    componentDidMount(): void {
        this.build(this.convertInput(this.props.data), this.props.rootId);
        this.setYOffset();
    }

    componentDidUpdate(prevProps: Readonly<ComponentProps<TreeProps>>, prevState: Readonly<TreeState>, snapshot?: any): void {
        if (prevProps.data != this.props.data || prevProps.rootId != this.props.rootId) {
            this.build(this.convertInput(this.props.data), this.props.rootId);
            this.setYOffset();
        }
    }

    convertInput(input: Array<InputType>): Dict {
        return input.reduce((obj: Dict, node: InputType) => (
            obj[node.id] = { id: node.id, color: node.color, children: node.nextId, category: node.category, fill: node.fill }, obj
        ), {});
    }

    build(nodes: Dict, root: number): void {
        const xOffset: number = 50;
        const yOffset: number = 50;
        let level: number = 1;
    
        let buffer: Array<[ Node, { x: number, y: number }, number ]> = [[nodes[root], {x: 0, y: 0}, -1]];
        let passedNodes: { [id: number]: { id: number, color: string, children: Array<number>, category: string, fill: boolean, position: { x: number, y: number }, originId: number } } = {};
        let toPass: Set<number> = new Set();
        let duplicates: Array<[ duplicateId: number, originId: number ]> = [];
        this.state.categoryLevels[nodes[root].category] = 0;
    
        while (buffer.length > 0) {
            const [node, position, originId] = buffer.shift()!;
    
            for (const childId of node.children) {
                if (toPass.has(childId)) {
                    duplicates.push([childId, node.id]);
                }
                else {
                    if (!this.state.categoryLevels.hasOwnProperty(nodes[childId].category)) {
                        let newOffset = this.state.categoryLevels[node.category] > 0 ? this.state.categoryLevels[node.category] + yOffset : this.state.categoryLevels[node.category] - yOffset;
                        if (this.state.categoryLevels[node.category] === 0) {
                            newOffset *= level;
                            if (level < 0) {
                                level--;
                            }
                            level *= -1;
                        }

                        this.state.categoryLevels[nodes[childId].category] = this.state.categoryLevels[node.category] + newOffset;
                    }
    
                    buffer.push([
                        nodes[childId],
                        {
                            x: position.x + xOffset,
                            y: this.state.categoryLevels[nodes[childId].category]
                        },
                        node.id
                    ]);
                    toPass.add(childId);
                }
            }
    
            passedNodes[node.id] = {...node, position, originId}
        }
    
        let pathsRender: React.ReactElement<any, any>[] = [];
        let nodesRender: React.ReactElement<any, any>[] = [];
        let buffer2: number[] = [];
    
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
    
            pathsRender.push((
                <g id={`p${originId}-${duplicateId}`} key={`p${originId}-${duplicateId}`}>
                    <path d={
                        `M ${passedNodes[originId].position.x} ${passedNodes[originId].position.y} C ${passedNodes[duplicateId].position.x} ${passedNodes[originId].position.y} ${passedNodes[originId].position.x} ${passedNodes[duplicateId].position.y} ${passedNodes[duplicateId].position.x} ${passedNodes[duplicateId].position.y}`
                        } stroke='black' strokeWidth={2} fill='none' />
                </g>
            ));
        }

        let buffer3: Array<{ id: number, color: string, children: Array<number>, category: string, fill: boolean, position: { x: number, y: number }, originId: number }> = [ passedNodes[root] ];
        let checked: Set<number> = new Set();

        while (buffer3.length > 0) {
            let node = buffer3.shift()!;

            if (!checked.has(node.id)) {
                if (node.originId !== -1) {
                    pathsRender.push((
                        <g id={`p${node.id}-${node.originId}`} key={`p${node.id}-${node.originId}`}>
                            <path d={
                                `M ${passedNodes[node.originId].position.x} ${passedNodes[node.originId].position.y} C ${node.position.x} ${passedNodes[node.originId].position.y} ${passedNodes[node.originId].position.x} ${node.position.y} ${node.position.x} ${node.position.y}`
                                } stroke='black' strokeWidth={2} fill='none' />
                        </g>
                    ));
                }

                nodesRender.push((
                    <g id={node.id.toString()} key={node.id}>
                        <g transform={`translate(${node.position.x}, ${node.position.y})`}>
                            <circle r='10' strokeWidth='2' stroke={node.color} fill={node.fill ? node.color : 'white'} />
                            <text y='25' x='-5'>{node.id}</text>
                        </g>
                    </g>
                ));

                for (const childId of node.children) {
                    buffer3.push(passedNodes[childId]);
                }

                checked.add(node.id);
            }
        }

        this.setState({
            pathsRender: pathsRender,
            nodesRender: nodesRender
        });
    }

    setYOffset(): void {
        let lowest: number = 0;

        for (const offset of Object.values(this.state.categoryLevels)) {
            if (offset < lowest) {
                lowest = offset;
            }
        }

        this.setState({ yOffset: 50 + (lowest * -1) });
    }

    render() {
        return (
            <svg { ...this.props.emit() }>
                <g transform={`translate(50, ${this.state.yOffset})`}>
                    { this.state.pathsRender }
                    { this.state.nodesRender }
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
