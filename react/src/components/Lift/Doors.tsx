import styled from 'styled-components';
import {LiftButton} from "./LiftButton";
import React from "react";
import {LiftProps} from "./Lift";

const Door = styled.div`
  width: 3em;
  height: 10em;
    top:4em;
  position: absolute;
  background-color: silver;
  transition: transform 1s;
  &.left {
    left: 3em;
    border-right: 1px solid black;
    &.open {
      transform: translate(-100%, 0);
    }
  }
  &.right {
    right: 3em;
    border-left: 1px solid black;
    &.open {
      transform: translate(100%, 0);
    }
  }
  &.closed {
    transform: translate(0, 0);
  }
`;

export const Doors = (props: LiftProps) => {
    const openClass = props.doors ? 'open' : 'closed';

    if (props.doors === 'open') {
        return (
            <>
                <Door className={`left ${openClass}`}/>
                <LiftButton lift={props.liftId.id} floor={props.liftId.floor} clickHandler={props.clickHandler}/>
                <Door className={`right ${openClass}`}/>
            </>
        );
    }

    return (
            <>
                <Door className={`left ${openClass}`}/>
                <Door className={`right ${openClass}`}/>
            </>
        );
};
