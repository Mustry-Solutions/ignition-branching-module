import * as React from 'react';
import Connection from './Connection';
import NodeElement from './Node';
import { BuildTree, InputType, NodeDict, Position, TreeNode } from './types';

interface BranchingComponentProps {
    data: InputType[];
    rootId: number;
    minXOffset: number;
    yOffset: number;
    curveSize?: number;
    lineWidth?: number;
    backgroundColor?: string;
    nodeSize?: number;
}

interface NodeState {
    yPadding: number;
    maxWidthElements: number;
    width: number;
    innerElements: JSX.Element[];
}

export class BranchingComponent extends React.Component<BranchingComponentProps, NodeState> {
    elementRef: React.RefObject<any>;
    constructor(props: BranchingComponentProps) {
        super(props);

        this.elementRef = React.createRef();
        this.state = {
            yPadding: 0,
            maxWidthElements: 0,
            width: 0,
            innerElements: []
        }
    }

    componentDidMount(): void {
        window.addEventListener('resize', this.handleResize);
        if (this.elementRef.current) {
            this.setState({width: this.elementRef.current.offsetWidth});
        }

        this.rebuildTree();
    }

    componentDidUpdate(prevProps: Readonly<BranchingComponentProps>, prevState: Readonly<NodeState>, snapshot?: any): void {
        if (this.props !== prevProps || prevState.width !== this.state.width) {
            this.rebuildTree();
        }
    }

    handleResize = (): void => {
        if (this.elementRef.current) {
            this.setState({width: this.elementRef.current.offsetWidth});
        }
    }

    rebuildTree(): void {
        const [tree, maxX] = this.buildTree(this.convertInput(this.props.data), this.props.rootId);
        const xOffset = (this.state.width - 100) / maxX < this.props.minXOffset ? this.props.minXOffset : (this.state.width - 100) / maxX;

        const [elements, yPadding] = this.displayTree(tree, xOffset, this.props.yOffset, this.props.curveSize);

        this.setState({yPadding, maxWidthElements: maxX, innerElements: elements});
    }

    convertInput(input: InputType[]): NodeDict {
        return input.reduce((obj: NodeDict, node: InputType): NodeDict => (
            obj[node.id] = {
                id: node.id,
                name: node.name,
                color: node.color,
                children: node.nextId ? node.nextId : [],
                category: node.category,
                fill: node.fill,
                style: node.style
            }, obj
        ), {});
    }

    buildTree(nodes: NodeDict, rootId: number): [BuildTree, number] {
        let result: BuildTree = {};
        let buffer: [TreeNode, Position, number][] = [[nodes[rootId], {x: 0, y: 0}, -1]];
        let inBuffer: Set<number> = new Set();
        inBuffer.add(rootId);
        let duplicateOrigins: [ duplicateId: number, originId: number ][] = [];
        let level: number = 0;
        let categoryLevels: { [ category: string ]: number } = {};
        categoryLevels[nodes[rootId].category] = 0;
        let maxX: number = 0;

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

            maxX = position.x > maxX ? position.x : maxX;
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
                        maxX = result[nodeId].position.x > maxX ? result[nodeId].position.x : maxX;

                        forwarBuffer.push(...result[nodeId].node.children);
                        forwarded.add(nodeId);
                    }
                }
            }

            result[duplicateId].originIds.push(originId);
        }

        return [result, maxX];
    }

    displayTree(nodeTree: BuildTree, xOffset: number, yOffset: number, curveSize: number | undefined): [JSX.Element[], number] {
        let result: JSX.Element[] = [];
        let minY: number = 0;

        for (const {node, position, originIds} of Object.values(nodeTree)) {
            minY = position.y < minY ? position.y : minY;

            result.push(
                <NodeElement
                    key={node.id}
                    icon={'material/check'}
                    iconColor='white'
                    name={node.name}
                    x={position.x * xOffset}
                    y={position.y * yOffset}
                    color={node.color}
                    backgroundColor={this.props.backgroundColor}
                    fill={node.fill}
                    size={this.props.nodeSize}
                    textSpace={xOffset - 30}
                    styleEmit={node.style}
                />
            );
            
            for (const originId of originIds) {
                if (originId !== -1) {
                    result.push(
                        <Connection
                            key={originId + '-' + node.id}
                            from={{x: nodeTree[originId].position.x * xOffset, y: nodeTree[originId].position.y * yOffset}}
                            to={{x: position.x * xOffset, y: position.y * yOffset}}
                            curveSize={curveSize}
                            color={nodeTree[originId].node.color}
                            lineWidth={this.props.lineWidth}
                            padding={10}
                        />
                    );
                }
            }
        }

        return [result, minY * -1 * yOffset];
    }

    render() {
        return (
            <div ref={this.elementRef} className='nodeTreeWrapper'>
                <div className='nodeTree' style={{transform: `translate(50px, ${this.state.yPadding + 50}px)`}}>
                    {this.state.innerElements}
                </div>
            </div>
        );
    }
}
