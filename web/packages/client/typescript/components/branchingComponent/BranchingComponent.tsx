import * as React from 'react';
import {
    Component,
    ComponentMeta,
    ComponentProps,
    PComponent,
    PropertyTree,
    SizeObject
} from '@inductiveautomation/perspective-client';
import { InputType, TreeNode, NodeDict, Position, BuildTree } from './types';
import NodeElement from './Node';
import Connection from './Connection';

interface BranchingComponentProps {
    data: InputType[];
    rootId: number;
    minXOffset: number;
    yOffset: number;
    curveSize?: number;
    lineWidth?: number;
    connectionColor?: string;
    backgroundColor?: string;
    nodeSize?: number;
}

interface NodeState {
    yPadding: number;
    maxWidthElements: number;
    width: number;
    innerElements: JSX.Element[];
}

export class BranchingComponent extends Component<ComponentProps<BranchingComponentProps>, NodeState> {
    constructor(props: ComponentProps<BranchingComponentProps>) {
        super(props);

        this.state = {
            yPadding: 0,
            maxWidthElements: 0,
            width: 0,
            innerElements: []
        }
    }

    componentDidMount(): void {
        window.addEventListener('resize', this.handleResize);

        // props.store.element is instead of using reference in react, this is the way ignition implements it
        if (this.props.store.element) {
            const nodeTreeWrapper = this.props.store.element.querySelector('.nodeTreeWrapper')
            if (nodeTreeWrapper) {
                this.setState({width: nodeTreeWrapper.getBoundingClientRect().width});
            }
        }

        this.rebuildTree();
    }

    componentDidUpdate(prevProps: Readonly<ComponentProps<BranchingComponentProps>>, prevState: Readonly<NodeState>, snapshot?: any): void {
        if (this.props.props !== prevProps.props || prevState.width !== this.state.width) {
            this.rebuildTree();
        }
    }

    handleResize = (): void => {        
        if (this.props.store.element) {
            const nodeTreeWrapper = this.props.store.element.querySelector('.nodeTreeWrapper')
            if (nodeTreeWrapper) {
                this.setState({width: nodeTreeWrapper.getBoundingClientRect().width});
            }
        }
    }

    rebuildTree(): void {
        const [tree, maxX] = this.buildTree(this.convertInput(this.props.props.data), this.props.props.rootId);
        const nodeSize = this.props.props.nodeSize ? this.props.props.nodeSize : 20;
        let xOffset = (this.state.width - nodeSize) / maxX;
        xOffset = xOffset < this.props.props.minXOffset ? this.props.props.minXOffset : xOffset;

        const [elements, yPadding] = this.displayTree(tree, xOffset, this.props.props.yOffset, this.props.props.curveSize);
        

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
                colorOutgoing: node.colorOutgoing,
                icon: node.icon,
                style: node.style
            }, obj
        ), {});
    }

    buildTree(nodes: NodeDict, rootId: number): [BuildTree, number] {
        if (Object.keys(nodes).length === 0) {
            return [{}, 0];
        }

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
                    icon={node.icon?.path}
                    iconColor={node.icon?.color}
                    name={node.name}
                    x={position.x * xOffset}
                    y={position.y * yOffset}
                    color={node.color}
                    backgroundColor={this.props.props.backgroundColor}
                    fill={node.fill}
                    size={this.props.props.nodeSize}
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
                            color={nodeTree[originId].node.colorOutgoing ? nodeTree[originId].node.color : this.props.props.connectionColor}
                            lineWidth={this.props.props.lineWidth}
                            padding={10}
                        />
                    );
                }
            }
        }

        return [result, minY * -1 * yOffset];
    }

    render() {
        const nodeDisposition = this.props.nodeSize ? this.props.nodeSize / 2 : 10;

        const emitter = this.props.emit();
        emitter.style['min-width'] = `${this.state.maxWidthElements * this.props.props.minXOffset}px`;
        emitter.className = emitter.className ? emitter.className + ' nodeTreeWrapperWrapper' : 'nodeTreeWrapperWrapper';
        return (
            <div {...emitter}>
                <div className='nodeTreeWrapper'>
                    <div className='nodeTree' style={{transform: `translate(${nodeDisposition}px, ${this.state.yPadding + nodeDisposition}px)`}}>
                        {this.state.innerElements}
                    </div>
                </div>
            </div>
        );
    }
}

export const COMPONENT_TYPE = 'mustryui.display.branching';

export class BranchingComponentMeta implements ComponentMeta {
    getComponentType(): string {
        return COMPONENT_TYPE;
    }

    getViewComponent(): PComponent {
        return BranchingComponent;
    }

    getDefaultSize(): SizeObject {
        return ({
            width: 500,
            height: 500
        });
    }

    getPropsReducer(propsTree: PropertyTree): BranchingComponentProps {
        return {
            data: propsTree.readArray('data', []),
            rootId: propsTree.readNumber('rootId', 0),
            minXOffset: propsTree.readNumber('minXOffset', 50),
            yOffset: propsTree.readNumber('yOffset', 50),
            curveSize: propsTree.readNumber('curveSize', 10),
            lineWidth: propsTree.readNumber('lineWidth', 2),
            connectionColor: propsTree.readString('connectionColor', 'black'),
            backgroundColor: propsTree.readString('backgroundColor', 'white'),
            nodeSize: propsTree.readNumber('nodeSize', 20)
        };
    }
}
