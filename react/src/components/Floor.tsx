import React from 'react';
import {Lift} from "./Lift/Lift";
import ControlPanel from "./ControlPanel/ControlPanel";
import styled, {css} from "styled-components";
import {Wrapper} from "./utils";
import {ceil} from "lodash-es";
import {Blank} from "./Lift/Blank";
import {FloorProps} from "./Building";


const LabelContainer = styled(Wrapper)`
    font-family: Helvetica, sans-serif;
    font-size: 2em;
    padding: 0.4em 0;
    color: white;

    width: 120px;
    height: 10px;
    line-height: 1em;

`;

export const FloorNumber = styled.span`
    margin-left: 5px;
`;


const Label = (props: { floor_name: string; }) => {
    return (
        <LabelContainer>
            <FloorNumber> {props.floor_name}</FloorNumber>
        </LabelContainer>
    );
};


const FloorContainer = styled(Wrapper)<{ maxPanels: number; }>`

    background-color: dimgray;
`;

function nextFloor(floor: number, lift_floor: number) {
    console.log('door')
    if (floor === lift_floor) {
        return 'open'
    }
    return 'closed'
}

export default function Floor(props: FloorProps) {



    const liftElements = []
    const half = ceil(Object.keys(props.liftConfig["lifts"]).length / 2);
    let i = 1
    let leftLifts = []
    for (const [liftId, config] of Object.entries(props.liftConfig["lifts"])) {
        if (config["serviced_floors"].includes(props.floor_level)) {
            liftElements.push(
                <Lift
                    liftId={{floor: props.floor_level, id: Number(liftId)}}
                    currentFloor={props.liftStatus["lifts"][Number(liftId)]["floor"]}
                    requestedFloors={props.liftStatus["lifts"][Number(liftId)]["destinations"]}
                    servicedFloors={props.liftConfig["lifts"][Number(liftId)]["serviced_floors"]}
                    doorsOpen={props.liftStatus["lifts"][Number(liftId)]["floor"] === props.floor_level}
                    clickHandler={props.liftButtonHandler}
                ></Lift>
            )
            if (i <= half) {
                leftLifts.push(Number(liftId))
            }
        } else {
            liftElements.push(
                <Blank/>
            )
        }
        if (i === half) {
            for (let p = 1; p <= props.numberOfPanels; p++) {
                liftElements.push(
                    <ControlPanel floor={props.floor_level} leftLifts={leftLifts}
                                  floorCount={props.numberOfFloors}></ControlPanel>
                )
            }
        }
        i += 1;
    }

    return (
        <FloorContainer maxPanels={props.maxPanels}>
            <Label floor_name={props.floor_name}/>
            {liftElements}
        </FloorContainer>
    )

}