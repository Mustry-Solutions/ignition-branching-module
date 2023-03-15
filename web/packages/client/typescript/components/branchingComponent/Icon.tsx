import * as React from 'react';

interface IconProps {
    path: string;
    color: string;
}

export default class Icon extends React.Component<IconProps, {}> {
    render() {
        //const svgFile = this.props.path.split('/')[0];
        // const svgId = this.props.path.split('/')[1];
        // const iconSheet = require('../icons/material.svg').default;

        return (
            <div className='icon' style={{
                //maskImage: `url(${iconSheet}#${svgId})`,
                // backgroundColor: this.props.color
            }}></div>
        );
    }
}
