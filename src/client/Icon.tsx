import * as React from 'react';

interface IconProps {
    path: string;
    color: string;
}

const Icon = ({path, color}: IconProps) => {
    const svgFile = path.split('/')[0];
    const svgId = path.split('/')[1];
    const iconSheet = require('../icons/material.svg').default;

    return (
        <div className='icon' style={{
            maskImage: `url(${iconSheet}#${svgId})`,
            backgroundColor: color
        }}></div>
    );
}

export default Icon;
