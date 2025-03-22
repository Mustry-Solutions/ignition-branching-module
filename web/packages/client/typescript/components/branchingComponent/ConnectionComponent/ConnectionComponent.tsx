import * as React from 'react';
import './ConnectionComponent.css';
import { Position } from '../types';

interface ConnectionComponentProps {
    from: Position;
    fromSplitPoint?: number;
    to: Position;
    toSplitPoint?: number;
    curveSize?: number;
    color?: string;
    lineWidth?: number;
    padding?: number;
}

const ConnectionComponent = ({
    from,
    to,
    fromSplitPoint = (to.x - from.x) / 2,
    toSplitPoint = (to.x - from.x) / 2,
    curveSize = 0,
    color = '#000000',
    lineWidth = 2,
    padding = 10
}: ConnectionComponentProps) => {
    const margin: number = padding / 2;
    const curveStep: number = from.y === to.y ? 0 : curveSize;

    const fromHigher = from.y < to.y;

    const step0: Position = {x: margin, y: fromHigher ? margin : from.y - to.y + margin};
    const step1: Position = {x: step0.x + fromSplitPoint - curveStep, y: step0.y};
    const step2: Position = {x: step1.x + curveStep, y: fromHigher ? step1.y + curveStep : step1.y - curveStep};
    const step3: Position = {x: toSplitPoint + margin, y: fromHigher ? to.y - from.y + margin - curveStep : margin + curveStep};
    const step4: Position = {x: step3.x + curveStep, y: fromHigher ? step3.y + curveStep : step3.y - curveStep};
    const step5: Position = {x: to.x - from.x + margin, y: step4.y};

    return (
        <svg className='nodePath' style={{
                left: from.x - margin ,
                top: from.y < to.y ? from.y - margin  : to.y - margin ,
                width: to.x - from.x + padding,
                height: Math.abs(from.y - to.y) + padding
                }}>
            <path d={
                `M ${step0.x} ${step0.y} L ${step1.x} ${step1.y}`
                } stroke={color} strokeWidth={lineWidth} fill='none' />
            <path d={
                `M ${step1.x} ${step1.y} C ${step1.x} ${step1.y} ${step2.x} ${step1.y} ${step2.x} ${step2.y}`
                } stroke={color} strokeWidth={lineWidth} fill='none' />
            <path d={
                `M ${step2.x} ${step2.y} L ${step3.x} ${step3.y}
                `} stroke={color} strokeWidth={lineWidth} fill='none' />
            <path d={
                `M ${step3.x} ${step3.y} C ${step3.x} ${step3.y} ${step3.x} ${step4.y} ${step4.x} ${step4.y}
                `} stroke={color} strokeWidth={lineWidth} fill='none' />
            <path d={
                `M ${step4.x} ${step4.y} L ${step5.x} ${step5.y}`
                } stroke={color} strokeWidth={lineWidth} fill='none' />
        </svg>
    );
}

export default ConnectionComponent;
