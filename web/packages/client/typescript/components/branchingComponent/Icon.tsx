import * as React from 'react';
import { IconRenderer } from '@inductiveautomation/perspective-client'

interface IconProps {
    path: string;
    color: string;
}

const Icon = ({path, color}: IconProps) => {
    return (
        <div className='icon'>
            <IconRenderer color={color} path={path} />
        </div>
    );
}

export default Icon;
