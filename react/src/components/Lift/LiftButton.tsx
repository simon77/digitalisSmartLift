import React from 'react';
import styled from 'styled-components';
import {Wrapper} from '..';
// import { useDebugMode } from '../hooks';
// import { Floor } from '../models';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowsDownToLine} from '@fortawesome/free-solid-svg-icons';

export interface ILiftButtons {
    lift: number
    floor: number
    clickHandler: (lift:number, floor:number) => Promise<void>;
}

const LiftButtonWrapper = styled(Wrapper)`
    flex-flow: row wrap;

    width: 6em;
    overflow: hidden auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        width: 0px;
    }

    &.debug {
        z-index: 50;
    }
`;

const Button = styled.span`
    display: block;
    box-sizing: border-box;
    margin: 0.1em;

    width: calc(4em - 0.2em);
    height: calc(2em - 0.2em);
    line-height: calc(2em - 0.2em);

    cursor: pointer;
    background-color: #3f4045;
    text-align: center;
    outline: 0.32em solid #747681;
    outline-offset: -0.32em;
    color: #f5efed;

    transition: outline-color 0.3s ease-in;

    &.active {
        outline-color: red;
    }
`;


export const LiftButton = ({clickHandler, lift, floor}: ILiftButtons) => {
    return (
        <LiftButtonWrapper>
            <Button onClick={() => clickHandler(lift, floor)}>
                <FontAwesomeIcon icon={faArrowsDownToLine} rotation={270}/>
                <FontAwesomeIcon icon={faArrowsDownToLine} rotation={90}/>
            </Button>
        </LiftButtonWrapper>
    );
};
