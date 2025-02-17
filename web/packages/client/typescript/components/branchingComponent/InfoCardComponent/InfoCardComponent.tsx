import * as React from 'react';
import './InfoCardComponent.css';
import Markdown from 'react-markdown';

interface InfoCardProps {
    markdown?: string;
    backgroundColor: string;
    styleEmit?: object;
}

const InfoCardComponent = ({
    markdown = '',
    backgroundColor,
    styleEmit = {}
}: InfoCardProps) => {
    return (
        <div
            className='infoCardWrapper'
            style={{ backgroundColor, ...styleEmit }}
        >
            <Markdown>{markdown}</Markdown>
        </div>
    );
}

export default InfoCardComponent;
