import * as React from 'react';

export interface InputType {
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

export class Tree extends React.Component<TreeProps, TreeState> {
    //elementRef: React.Ref<SVGSVGElement> | undefined;

    constructor(props: TreeProps) {
        super(props);
        this.state = {
            categoryLevels: {},
            yOffset: 50,
            pathsRender: [],
            nodesRender: []
        }

        //this.elementRef = React.createRef();
    }

    componentDidMount(): void {
        this.build(this.convertInput(this.props.data), this.props.rootId);
        this.setYOffset();
    }

    componentDidUpdate(prevProps: Readonly<TreeProps>, prevState: Readonly<TreeState>, snapshot?: any): void {
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

            let color = passedNodes[originId].color;
            let from = passedNodes[originId].position;
            let to = passedNodes[duplicateId].position;

            let curveStep = from.y === to.y ? 0 : 20;

            let step1 = {x: from.x + ((to.x - from.x) / 2) - curveStep, y: from.y};
            let step2 = {x: step1.x + curveStep, y: from.y < to.y ? step1.y + curveStep : step1.y - curveStep};
            let step3 = {x: step2.x, y: from.y < to.y ? to.y - curveStep : to.y + curveStep};
            let step4 = {x: step3.x + curveStep, y: to.y};
    
            pathsRender.push((
                <g id={`p${originId}-${duplicateId}`} key={`p${originId}-${duplicateId}`}>
                    <path d={
                        `M ${from.x} ${from.y} L ${step1.x} ${step1.y}`
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
                        `M ${step4.x} ${step4.y} L ${to.x} ${to.y}`
                        } stroke={color} strokeWidth={2} fill='none' />
                </g>
            ));
        }

        let buffer3: Array<{ id: number, color: string, children: Array<number>, category: string, fill: boolean, position: { x: number, y: number }, originId: number }> = [ passedNodes[root] ];
        let checked: Set<number> = new Set();

        while (buffer3.length > 0) {
            let node = buffer3.shift()!;

            if (!checked.has(node.id)) {
                if (node.originId !== -1) {
                    let color = passedNodes[node.originId].color;
                    let from = passedNodes[node.originId].position;
                    let to = node.position;

                    let curveStep = from.y === to.y ? 0 : 20;

                    let step1 = {x: from.x + ((to.x - from.x) / 2) - curveStep, y: from.y};
                    let step2 = {x: step1.x + curveStep, y: from.y < to.y ? step1.y + curveStep : step1.y - curveStep};
                    let step3 = {x: step2.x, y: from.y < to.y ? to.y - curveStep : to.y + curveStep};
                    let step4 = {x: step3.x + curveStep, y: to.y};

                    pathsRender.push((
                        <g id={`p${node.id}-${node.originId}`} key={`p${node.id}-${node.originId}`}>
                            <path d={
                                `M ${from.x} ${from.y} L ${step1.x} ${step1.y}`
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
                                `M ${step4.x} ${step4.y} L ${to.x} ${to.y}`
                                } stroke={color} strokeWidth={2} fill='none' />
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
            <svg style={{ height: '100%', width: '100%' }}>
                <g transform={`translate(50, ${this.state.yOffset})`}>
                    { this.state.pathsRender }
                    { this.state.nodesRender }
                </g>
            </svg>
        );
    }
}

export default Tree;
