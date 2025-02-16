export interface InputType {
    id: number;
    name?: string;
    color?: string;
    nextId?: number[];
    category: number;
    fill?: boolean;
    style?: Object;
    infoCardMarkdown?: string;
    infoCardStyle?: object;
}

export interface TreeNode {
    id: number;
    name?: string;
    color?: string;
    children: number[];
    category: number;
    fill?: boolean;
    style?: object;
    infoCardMarkdown?: string;
    infoCardStyle?: object;
}

export interface NodeDict {
    [id: number]: TreeNode;
}

export interface Position {
    x: number,
    y: number
}

export interface BuildTree {
    [id: number]: {
        node: TreeNode,
        position: Position,
        origins: Origin[]
    }
}

export interface Origin {
    id: number,
    split: [number, number]
}