import * as React from 'react';
import { Position } from './types';

interface ConnectionProps {
    from: Position;
    to: Position;
    curveSize: number;
    color: string;
    padding: number;
}

export class Connection extends React.Component<ConnectionProps, {}> {
    render() {
        const margin: number = this.props.padding / 2;
        const curveStep: number = this.props.from.y === this.props.to.y ? 0 : this.props.curveSize;

        const step0: Position = {x: margin, y: this.props.from.y < this.props.to.y ? margin : this.props.from.y - this.props.to.y + margin};
        const step1: Position = {x: step0.x + (this.props.to.x - this.props.from.x) / 2 - curveStep, y: step0.y};
        const step2: Position = {x: step1.x + curveStep, y: this.props.from.y < this.props.to.y ? step1.y + curveStep : step1.y - curveStep};
        const step3: Position = {x: step2.x, y: this.props.from.y < this.props.to.y ? this.props.to.y - this.props.from.y + margin - curveStep : margin + curveStep};
        const step4: Position = {x: step3.x + curveStep, y: this.props.from.y < this.props.to.y ? step3.y + curveStep : step3.y - curveStep};
        const step5: Position = {x: this.props.to.x - this.props.from.x + margin, y: step4.y};

        return (
            <svg className='nodePath' style={{
                    left: this.props.from.x - margin,
                    top: this.props.from.y < this.props.to.y ? this.props.from.y - margin : this.props.to.y - margin,
                    width: this.props.to.x - this.props.from.x + this.props.padding,
                    height: Math.abs(this.props.from.y - this.props.to.y) + this.props.padding
                    }}>
                <path d={
                    `M ${step0.x} ${step0.y} L ${step1.x} ${step1.y}`
                    } stroke={this.props.color} strokeWidth={2} fill='none' />
                <path d={
                    `M ${step1.x} ${step1.y} C ${step1.x} ${step1.y} ${step2.x} ${step1.y} ${step2.x} ${step2.y}`
                    } stroke={this.props.color} strokeWidth={2} fill='none' />
                <path d={
                    `M ${step2.x} ${step2.y} L ${step3.x} ${step3.y}
                    `} stroke={this.props.color} strokeWidth={2} fill='none' />
                <path d={
                    `M ${step3.x} ${step3.y} C ${step3.x} ${step3.y} ${step3.x} ${step4.y} ${step4.x} ${step4.y}
                    `} stroke={this.props.color} strokeWidth={2} fill='none' />
                <path d={
                    `M ${step4.x} ${step4.y} L ${step5.x} ${step5.y}`
                    } stroke={this.props.color} strokeWidth={2} fill='none' />
            </svg>
        );
    }
}
