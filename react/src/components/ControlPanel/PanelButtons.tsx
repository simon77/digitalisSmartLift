import classNames from 'classnames';
import React, {useMemo} from 'react';
import styled from 'styled-components';
import {Wrapper} from '..';

import {IPanelButtons} from './ControlPanel'

const FloorButtonsWrapper = styled(Wrapper)`
    flex-flow: row wrap;

    width: 6em;
    overflow: hidden auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        width: 0px;
    }

`;

const Button = styled.span`
    display: block;
    box-sizing: border-box;
    margin: 0.1em;

    width: calc(2em - 0.2em);
    height: calc(2em - 0.2em);
    line-height: calc(2em - 0.2em);

    cursor: pointer;
    background-color: #3f4045;
    text-align: center;
    outline: 0.32em solid #747681;
    outline-offset: -0.32em;
    color: #f5efed;

    transition: outline-color 0.3s ease-in;
`;


export const PanelButtons = ({
                                 current_floor,
                                 floorCount,
                                 clickHandler,
                             }: IPanelButtons) => {
    const containerClassName = classNames({});

    const buttons = useMemo(() => {
            const highlightButton = new Array<boolean>(floorCount).fill(false);

            return highlightButton.map((highlight, floorIndex) => {
                const className = classNames({
                    active: highlight,
                });
                return (
                    <Button
                        key={floorIndex}
                        className={className}
                        onClick={() => clickHandler(current_floor, floorIndex)}
                    >
                        {floorIndex}
                    </Button>
                );
            });
        }, [
            // clickedFloors,
            floorCount,
            // clickHandler
        ]
    );

    return (
        <FloorButtonsWrapper className={`${containerClassName}`}>
            {buttons}
        </FloorButtonsWrapper>
    );
};
