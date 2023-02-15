import * as React from 'react';
import { NodeElement } from './Node';

export interface InputType {
    id: number;
    name: string;
    color: string;
    nextId: Array<number>;
    category: string;
    fill: boolean;
}

interface Node {
    id: number;
    name: string;
    color: string;
    children: Array<number>;
    category: string;
    fill: boolean;
}

interface NodeDict {
    [id: number]: Node;
}

interface Position {
    x: number,
    y: number
}

interface BuildTree {
    [id: number]: {
        node: Node, position: Position, originIds: number[]
    }
}

interface TreeProps {
    data: InputType[];
    rootId: number;
}

interface NodeState {
    yPadding: number;
    innerElements: JSX.Element[];
}

export class Tree extends React.Component<TreeProps, NodeState> {
    constructor(props: TreeProps) {
        super(props);
        this.state = {
            yPadding: 0,
            innerElements: []
        }
    }

    componentDidMount(): void {
        const [elements, yPadding] = this.displayTree(this.buildTree(this.convertInput(this.props.data), this.props.rootId));
        this.setState({yPadding, innerElements: elements})
    }

    convertInput(input: InputType[]): NodeDict {
        return input.reduce((obj: NodeDict, node: InputType) => (
            obj[node.id] = { id: node.id, name: node.name, color: node.color, children: node.nextId, category: node.category, fill: node.fill }, obj
        ), {});
    }

    buildTree(nodes: NodeDict, rootId: number): BuildTree {
        let result: BuildTree = {};
        let buffer: [Node, Position, number][] = [[nodes[rootId], {x: 0, y: 0}, -1]];
        let inBuffer: Set<number> = new Set();
        inBuffer.add(rootId);
        let duplicateOrigins: [ duplicateId: number, originId: number ][] = [];
        let level: number = 0;
        let categoryLevels: { [ category: string ]: number } = {};
        categoryLevels[rootId] = 0;

        while (buffer.length > 0) {
            const [node, position, originId] = buffer.shift()!;

            for (const childId of node.children) {
                if (inBuffer.has(childId)) {
                    duplicateOrigins.push([childId, node.id]);
                }
                else {
                    if (!(nodes[childId].category in categoryLevels)) {
                        level *= -1;
                        if (level <= 0) {
                            level--;
                        }

                        categoryLevels[nodes[childId].category] = level;
                    }

                    buffer.push([
                        nodes[childId],
                        {
                            x: position.x + 1,
                            y: categoryLevels[nodes[childId].category]
                        },
                        node.id
                    ]);

                    inBuffer.add(childId);
                }
            }

            result[node.id] = { node, position, originIds: [originId] };
        }
        

        for (const [duplicateId, originId] of duplicateOrigins) {
            if (result[originId].position.x >= result[duplicateId].position.x) {
                let behind = result[originId].position.x - result[duplicateId].position.x + 1;

                let forwarBuffer: number[] = [duplicateId];
                let forwarded: Set<number> = new Set();

                while (forwarBuffer.length > 0) {
                    const nodeId: number = forwarBuffer.shift()!;

                    if (!forwarded.has(nodeId)) {
                        result[nodeId].position.x += behind;

                        forwarBuffer.push(...result[nodeId].node.children);
                        forwarded.add(nodeId);
                    }
                }
            }

            result[duplicateId].originIds.push(originId);
        }

        return result;
    }

    displayTree(nodeTree: BuildTree): [JSX.Element[], number] {
        let result: JSX.Element[] = [];
        let smallestY: number = 0;

        const xOffset = 50;
        const yOffset = 50;
        const curveSize = 10;

        for (const {node, position, originIds} of Object.values(nodeTree)) {
            if (position.y < smallestY) {
                smallestY = position.y;
            }

            result.push(<NodeElement icon={undefined} name={node.id} x={position.x * xOffset} y={position.y * yOffset} />)
            
            for (const originId of originIds) {
                if (originId !== -1) {
                    const color = nodeTree[originId].node.color;
                    const padding: number = 10;
                    const margin = padding / 2;

                    const from: Position = {x: nodeTree[originId].position.x * xOffset, y: nodeTree[originId].position.y * yOffset};
                    const to: Position = {x: position.x * xOffset, y: position.y * yOffset};
                    
                    const curveStep = from.y === to.y ? 0 : curveSize;

                    const step0 = {x: margin, y: from.y < to.y ? margin : from.y - to.y + margin};
                    const step1 = {x: step0.x + (to.x - from.x) / 2 - curveStep, y: step0.y};
                    const step2 = {x: step1.x + curveStep, y: from.y < to.y ? step1.y + curveStep : step1.y - curveStep};
                    const step3 = {x: step2.x, y: from.y < to.y ? to.y - from.y - margin : margin + curveStep};
                    const step4 = {x: step3.x + curveStep, y: from.y < to.y ? step3.y + curveStep : step3.y - curveStep};
                    const step5 = {x: to.x - from.x + margin, y: step4.y};

                    result.push((
                        <svg className='nodePath' id={originId + '-' + node.id} style={{
                                left: from.x - margin,
                                top: from.y < to.y ? from.y - margin : to.y - margin,
                                width: to.x - from.x + padding,
                                height: Math.abs(from.y - to.y) + padding
                                }}>
                            <path d={
                                `M ${step0.x} ${step0.y} L ${step1.x} ${step1.y}`
                                } stroke={color} strokeWidth={2} fill='none' />
                            <path d={
                                `M ${step1.x} ${step1.y} C ${step1.x} ${step1.y} ${step2.x} ${step1.y} ${step2.x} ${step2.y}`
                                } stroke={color} strokeWidth={2} fill='none' />
                            <path d={
                                `M ${step2.x} ${step2.y} L ${step3.x} ${step3.y}
                                `} stroke={color} strokeWidth={2} fill='none' />
                            <path d={
                                `M ${step3.x} ${step3.y} C ${step3.x} ${step3.y} ${step3.x} ${step4.y} ${step4.x} ${step4.y}
                                `} stroke={color} strokeWidth={2} fill='none' />
                            <path d={
                                `M ${step4.x} ${step4.y} L ${step5.x} ${step5.y}`
                                } stroke={color} strokeWidth={2} fill='none' />
                        </svg>
                    ));
                }
            }
        }

        return [result, smallestY * -1 * yOffset];
    }

    render() {
        return (
            <div className='nodeTree' style={{transform: `translate(50px, ${this.state.yPadding + 50}px)`}}>
                {this.state.innerElements}
            </div>
        );
    }
}
