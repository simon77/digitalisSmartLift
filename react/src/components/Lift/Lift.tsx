import React from 'react';
import styled from 'styled-components';
import {Wrapper} from '..';
import {Screen} from "./Screen";
import {Doors} from "./Doors";
import {Label} from "./Label";

type LiftId = {
    floor: number,
    id: number,
}

export type LiftProps = {
    liftId: LiftId
    currentFloor: number
    servicedFloors: number[]
    requestedFloors: number[]
    doorsOpen: boolean
    direction?: 'up' | 'down'
    clickHandler: (lift: number, floor: number) => void;
};

export interface ILiftMoveData {
    "lift": number,
    "floor": number,
}

const ElevatorWrapper = styled(Wrapper)`
    width: 12em;
    height: 15em;

    position: relative;
    background-color: dimgray;

    transition: all 0.5s;

`;

export const Lift = (props: LiftProps) => {

    return (
        <ElevatorWrapper id={"floor" + props.liftId.floor + "lift" + props.liftId.id}>
            <Wrapper>
                <Label id={props.liftId.id}></Label>
                <Screen {...props} />
                <Doors {...props} />
            </Wrapper>
        </ElevatorWrapper>
    );
};
