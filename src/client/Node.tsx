import * as React from 'react';

interface NodeProps {
    icon: any;
    name: string;
    x: number;
    y: number;
}

interface NodeState {

}

export class NodeElement extends React.Component<NodeProps, NodeState> {
    constructor(props: NodeProps) {
        super(props);
    }

    render() {
        return (
            <div className='nodeWrapper' style={{left: this.props.x, top: this.props.y}}>
                <div className='node'>
                    <div className='iconWrapper'>
                        {this.props.icon}
                    </div>
                    
                    <p className='name'>{this.props.name}</p>
                </div>
            </div>
            
        );
    }
}
