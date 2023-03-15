export interface InputType {
    id: number;
    name?: string;
    color?: string;
    nextId?: number[];
    category: string;
    fill?: boolean;
}

export interface TreeNode {
    id: number;
    name?: string;
    color?: string;
    children: number[];
    category: string;
    fill?: boolean;
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
        node: TreeNode, position: Position, originIds: number[]
    }
}