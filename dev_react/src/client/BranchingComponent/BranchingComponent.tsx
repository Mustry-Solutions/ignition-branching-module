import * as React from 'react';
import './BranchingComponent.css'
import Connection from '../ConnectionComponent/ConnectionComponent';
import NodeElement from '../NodeComponent/NodeComponent';
import { BuildTree, InputType, NodeDict, Origin, Position, TreeNode } from '../types';

interface BranchingComponentProps {
    data: InputType[];
    rootId: number;
    minXOffset: number;
    yOffset: number;
    curveSize?: number;
    lineWidth?: number;
    backgroundColor?: string;
    nodeSize?: number;
    nodeBorderWidth?: number;
}

interface NodeState {
    yPadding: number;
    maxWidthElements: number;
    width: number;
    innerElements: JSX.Element[];
}

export class BranchingComponent extends React.Component<BranchingComponentProps, NodeState> {
    elementRef: React.RefObject<any>;

    static readonly defaultProps = { nodeSize: 20, nodeBorderWidth: 2 }

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
            this.setState({width: this.elementRef.current.getBoundingClientRect().width});
        }
    }

    rebuildTree(): void {
        const [tree, maxX] = this.buildTree(this.convertInput(this.props.data), this.props.rootId);
        const absoluteNodeSize = this.props.nodeSize! + (this.props.nodeBorderWidth! * 2);
        let xOffset = (this.state.width - absoluteNodeSize) / maxX;
        xOffset = xOffset < this.props.minXOffset ? this.props.minXOffset : xOffset;

        const [elements, yPadding] = this.displayTree(tree, xOffset, this.props.yOffset, this.props.curveSize);

        this.setState({yPadding, maxWidthElements: maxX, innerElements: elements});
    }

    convertInput(input: InputType[]): NodeDict {
        return input.reduce((obj: NodeDict, node: InputType): NodeDict => {
            const { nextId, ...validatedNode } = node;

            return (
                obj[node.id] = {
                    children: nextId ? nextId : [],
                    ...validatedNode
                }, obj
            );
        }, {});
    }

    buildTree(nodes: NodeDict, rootId: number): [BuildTree, number] {
        if (Object.keys(nodes).length === 0) {
            return [{}, 0];
        }

        // get all categories and order them to detirmen y level
        let categories: Set<number> = new Set<number>();
        Object.keys(nodes).forEach(nodeId => {
            categories.add(nodes[nodeId as unknown as number].category)
        });
        let sortedCategories = Array.from(categories);
        sortedCategories.sort((a, b) => a - b);

        const categoryLevels = sortedCategories.reduce((acc: {[key: number]: number}, category, index) => {
            acc[category] = index;
            return acc;
        }, {});

        let result: BuildTree = {};
        let buffer: [TreeNode, Position, number][] = [[nodes[rootId], {x: 0, y: categoryLevels[nodes[rootId].category]}, -1]];
        let inBuffer: Set<number> = new Set();
        inBuffer.add(rootId);
        let duplicateOrigins: [ duplicateId: number, originId: number ][] = [];
        let levels: { [ level: number ]: (number | undefined)[] } = {};
        for (let i = 0; i < categories.size; i++) {
            levels[i] = []
        }
        let maxX: number = 0;

        // BFS of all nodes starting with the root
        while (buffer.length > 0) {
            const [node, position, originId] = buffer.shift()!;

            for (const childId of node.children) {
                if (inBuffer.has(childId)) {
                    duplicateOrigins.push([childId, node.id]);
                }
                else {
                    let positionY = categoryLevels[nodes[childId].category]

                    buffer.push([
                        nodes[childId],
                        {
                            x: position.x + 1,
                            y: positionY
                        },
                        node.id
                    ]);

                    inBuffer.add(childId);
                }

                levels[position.y][position.x] = node.id;
            }

            

            maxX = position.x > maxX ? position.x : maxX;
            result[node.id] = { node, position, origins: originId === -1 ? [] : [{ id: originId, split: [ 0, 0 ] }] };
        }
        
        // loop over all duplicates while pushing forward nodes if neccessary
        for (const [duplicateId, originId] of duplicateOrigins) {
            if (result[originId].position.x >= result[duplicateId].position.x) {
                let behind = result[originId].position.x - result[duplicateId].position.x + 1;

                let forwarBuffer: number[] = [duplicateId];
                let forwarded: Set<number> = new Set();

                while (forwarBuffer.length > 0) {
                    const nodeId: number = forwarBuffer.shift()!;

                    if (!forwarded.has(nodeId)) {
                        // remove forwarding node from levels tree
                        if (levels[result[nodeId].position.y][result[nodeId].position.x] === nodeId) {
                            levels[result[nodeId].position.y][result[nodeId].position.x] = undefined;
                        }

                        // add x value that node is behind
                        result[nodeId].position.x += behind;
                        maxX = result[nodeId].position.x > maxX ? result[nodeId].position.x : maxX;

                        // add back with new coords
                        levels[result[nodeId].position.y][result[nodeId].position.x] = nodeId;

                        forwarBuffer.push(...result[nodeId].node.children);
                        forwarded.add(nodeId);
                    }
                }
            }

            result[duplicateId].origins.push({id: originId, split: [0, 0]});
        }

        // check if connection can be drawn in the middle
        for (let { position, origins } of Object.values(result)) {
            let minNodeSplit = position.x - 1;
            while (minNodeSplit > 0 && levels[position.y][minNodeSplit] === undefined) {
                minNodeSplit--;
            }

            for (let origin of origins) {
                const originPos = result[origin.id].position;
                let maxOriginSplit = originPos.x + 1;

                while (maxOriginSplit < levels[originPos.y].length && maxOriginSplit < position.y && levels[originPos.y][maxOriginSplit] === undefined) {
                    maxOriginSplit++;
                }

                if (maxOriginSplit === levels[originPos.y].length || maxOriginSplit > position.x) {
                    maxOriginSplit = position.x;
                }

                const tempMinNodeSplit = minNodeSplit < originPos.x ? originPos.x : minNodeSplit;

                if (maxOriginSplit > tempMinNodeSplit) {
                    const splitDiff = (maxOriginSplit - tempMinNodeSplit) / 2;
                    let splitPoint = splitDiff;
                    if (maxOriginSplit - originPos.x > position.x - tempMinNodeSplit) {
                        splitPoint = (position.x - originPos.x) - splitDiff;
                    }
                    origin.split = [ splitPoint, splitPoint ]
                }
                else {
                    origin.split = [tempMinNodeSplit + 0.5 - originPos.x, maxOriginSplit - 0.5 - originPos.x];
                }
            }
        }

        return [result, maxX];
    }

    displayTree(nodeTree: BuildTree, xOffset: number, yOffset: number, curveSize: number | undefined): [JSX.Element[], number] {
        let result: JSX.Element[] = [];
        let minY: number = 0;

        for (const {node, position, origins} of Object.values(nodeTree) as { node: TreeNode, position: Position, origins: Origin[] }[]) {
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
                    size={this.props.nodeSize!}
                    borderWidth={this.props.nodeBorderWidth!}
                    textSpace={xOffset - 30}
                    styleEmit={node.style}
                    infoCardMarkdown={node.infoCardMarkdown}
                    infoCardStyleEmit={node.infoCardStyle}
                />
            );
            
            for (const origin of origins) {
                result.push(
                    <Connection
                        key={origin.id + '-' + node.id}
                        from={{x: nodeTree[origin.id].position.x * xOffset, y: nodeTree[origin.id].position.y * yOffset}}
                        fromSplitPoint={origin.split[1] * xOffset}
                        to={{x: position.x * xOffset, y: position.y * yOffset}}
                        toSplitPoint={origin.split[0] * xOffset}
                        curveSize={curveSize}
                        color={nodeTree[origin.id].node.color}
                        lineWidth={this.props.lineWidth}
                        padding={10}
                    />
                );
            }
        }

        return [result, minY * -1 * yOffset];
    }

    render() {
        const nodeDisposition = (this.props.nodeSize! / 2) + this.props.nodeBorderWidth!;
        
        return (
            <div>
                <div ref={this.elementRef} className='nodeTreeWrapper'>
                    <div className='nodeTree' style={{top: nodeDisposition, left: this.state.yPadding + this.props.nodeBorderWidth!}}>
                        {this.state.innerElements}
                    </div>
                </div>
            </div>
        );
    }
}
