import React from 'react';
import styled, {css} from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowsLeftRight, faArrowsUpDown, faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {Wrapper} from '..';

export type LiftScreenProps = {
    servicedFloors: number[],
    requestedFloors: number[],
    currentFloor: number,
    doors: 'open' | 'closed',
    direction?: 'up' | 'down'
};

const OuterContainer = styled(Wrapper)`
    position: absolute;
    top: 2.5em;

    font-family: 'Seven Segment Regular', monospace;
    font-size: 0.9em;
    background-color: black;
    padding: 0.4em 0;
    color: #502d02;

    width: 12em;
    height: 1em;
    line-height: 1em;

    .icon {
        position: absolute;
        left: 0.1em;
        color: orange;
    }
`;

const FloorNumber = styled.span<{ requested?: boolean; current?: boolean; }>`
    margin-left: 5px;
    ${props =>
            props.requested &&
            css`
                color: orange;
            `};
    ${props =>
            props.current &&
            css`
                color: red;
            `};
`;

export const Screen = (props: LiftScreenProps) => {
    const stateIcon =
        props.doors === 'open' ? faArrowsLeftRight
            : props.direction === 'up' ? faArrowUp
                : props.direction === 'down' ? faArrowDown
                    : faArrowsUpDown;


    const elems = props.servicedFloors.map(item => {
        const requestedFlag = props.requestedFloors.includes(item)
        const currentFlag = item === props.currentFloor

        return <FloorNumber requested={requestedFlag} current={currentFlag}> {item} </FloorNumber>
    })
    return (
        <OuterContainer>
            <FontAwesomeIcon icon={stateIcon} fixedWidth className="icon"/>
            {elems}
        </OuterContainer>
    );
};
