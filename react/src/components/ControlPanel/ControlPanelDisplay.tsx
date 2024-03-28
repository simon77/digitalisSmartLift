import React from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {Wrapper} from '..';
import {IPanelDisplay} from './ControlPanel'


const OuterContainer = styled(Wrapper)`
    position: absolute;
    top: 0.8em;
    font-family: 'Seven Segment Regular', monospace;
    font-size: 0.9em;
    background-color: black;
    padding: 0.4em 0;
    color: orange;

    width: 7em;
    height: 1em;
    line-height: 1em;

    .left-icon {
        position: absolute;
        left: 0.4em;
    }

    .right-icon {
        position: absolute;
        right: 0.4em;
    }

    .hidden {
        display: none;
    }

    @font-face {
        font-family: 'Seven Segment Regular';
        font-style: normal;
        font-weight: normal;
        src: local('Seven Segment Regular'), url('../../fonts/Seven Segment.woff') format('woff');
    }
`;

const LiftNumber = styled.span`
    margin-left: 5px;
`;

export default function ControlPanelDisplay(props: IPanelDisplay) {
    const leftClass =
        props.direction === 'left' ? "left-icon fa-beat" : "left-icon hidden";
    const rightClass =
        props.direction === 'right' ? "right-icon fa-beat" : "right-icon hidden";

    return (
        <OuterContainer>
            <FontAwesomeIcon icon={faArrowLeft} fixedWidth className={leftClass}/>
            <LiftNumber> {props.liftToUse}</LiftNumber>
            <FontAwesomeIcon icon={faArrowRight} fixedWidth className={rightClass}/>
        </OuterContainer>
    );
}
