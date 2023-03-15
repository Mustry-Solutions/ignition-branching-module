import * as React from 'react';
import Icon from './Icon';

interface NodeProps {
    icon?: string;
    iconColor?: string;
    name?: string;
    x: number;
    y: number;
    color?: string;
    backgroundColor?: string;
    fill?: boolean;
    size?: number;
    textSpace: number;
}

const NodeElement = ({
    icon,
    iconColor = '#ffffff',
    name = '',
    x,
    y,
    color = '#000000',
    backgroundColor = '#ffffff',
    fill = true,
    size = 20,
    textSpace
}: NodeProps) => {
    return (
        <div className='nodeWrapper' style={{left: x, top: y}}>
            <div className='node' style={{backgroundColor: backgroundColor}}>
            <div className='iconWrapper' style={{
                    borderColor: color,
                    backgroundColor: fill ? color : backgroundColor,
                    width: size,
                    height: size
                }}>
                    {
                        icon && <Icon path={icon} color={iconColor} />
                    }
                </div>
                
                <p className='name' style={{
                    width: textSpace
                }}>
                    {name}
                </p>
            </div>
        </div>
    );
}

export default NodeElement;
