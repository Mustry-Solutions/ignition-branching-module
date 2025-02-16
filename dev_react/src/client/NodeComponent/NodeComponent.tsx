import * as React from 'react';
import './NodeComponent.css';
import Icon from '../IconComponent/IconComponent';
import InfoCard from '../InfoCardComponent/InfoCardComponent';

const placeholderText = `
# Title
## Subtitle
There is some text here that should be rendered.
- Couple of interresting points
- And also this
`;

interface NodeProps {
    icon?: string;
    iconColor?: string;
    name?: string;
    x: number;
    y: number;
    color?: string;
    backgroundColor?: string;
    fill?: boolean;
    size: number;
    borderWidth: number;
    textSpace: number;
    styleEmit?: object;
    infoCardMarkdown?: string;
    infoCardStyleEmit?: object;
}

// TODO: replace placeholder markdown
const NodeElement = ({
    icon,
    iconColor = '#ffffff',
    name = '',
    x,
    y,
    color = '#000000',
    backgroundColor = '#ffffff',
    fill = true,
    size,
    borderWidth,
    textSpace,
    styleEmit = {},
    infoCardMarkdown,
    infoCardStyleEmit
}: NodeProps) => (
    <div 
        className='nodeWrapper'
        style={{
            left: x - (size / 2) - borderWidth,
            top: y - (size / 2) - borderWidth,
            ...styleEmit
        }}
    >
        <div className='nodeContentWrapper'>
            <div className='node' style={{backgroundColor: backgroundColor}}>
            <div className='iconWrapper' style={{
                    borderColor: color,
                    borderWidth: borderWidth,
                    backgroundColor: fill ? color : backgroundColor,
                    width: size,
                    height: size
                }}>
                    { icon && <Icon path={icon} color={iconColor} /> }
                </div>
                
                <p className='name' style={{
                    width: textSpace
                }}>
                    {name}
                </p>
            </div>
        </div>
        <InfoCard
            markdown={placeholderText}
            backgroundColor={backgroundColor}
            styleEmit={infoCardStyleEmit}
        />
    </div>
);

export default NodeElement;
