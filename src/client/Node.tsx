import * as React from 'react';
import Icon from './Icon';

interface NodeProps {
    icon: any;
    name: string;
    x: number;
    y: number;
    color: string;
    backgroundColor: string;
    fill: boolean;
}

export class NodeElement extends React.Component<NodeProps, {}> {
    constructor(props: NodeProps) {
        super(props);
    }

    render() {
        return (
            <div className='nodeWrapper' style={{left: this.props.x, top: this.props.y}}>
                <div className='node' style={{backgroundColor: this.props.backgroundColor}}>
                    <div className='iconWrapper' style={{
                        borderColor: this.props.color,
                        backgroundColor: this.props.fill ? this.props.color : 'white',
                        }}>
                        <Icon path='material/check' color='white' />
                    </div>
                    
                    <p className='name'>{this.props.name}</p>
                </div>
            </div>
            
        );
    }
}
