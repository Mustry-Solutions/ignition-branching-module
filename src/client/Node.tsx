import * as React from 'react';
import Icon from './Icon';

interface NodeProps {
    icon: string;
    iconColor: string;
    name: string;
    x: number;
    y: number;
    color: string;
    backgroundColor: string;
    fill: boolean;
    size: number;
}

export class NodeElement extends React.Component<NodeProps, {}> {
    render() {
        return (
            <div className='nodeWrapper' style={{left: this.props.x, top: this.props.y}}>
                <div className='node' style={{backgroundColor: this.props.backgroundColor}}>
                    <div className='iconWrapper' style={{
                        borderColor: this.props.color,
                        backgroundColor: this.props.fill ? this.props.color : this.props.backgroundColor,
                        width: this.props.size,
                        height: this.props.size
                        }}>
                        <Icon path={this.props.icon} color={this.props.iconColor} />
                    </div>
                    
                    <p className='name' style={{backgroundColor: this.props.backgroundColor}}>{this.props.name}</p>
                </div>
            </div>
            
        );
    }
}
