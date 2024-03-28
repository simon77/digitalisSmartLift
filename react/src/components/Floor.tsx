import React, {useContext, useEffect, useState} from 'react';
import {Lift} from "./Lift/Lift";
import ControlPanel from "./ControlPanel/ControlPanel";
import styled from "styled-components";
import {Wrapper} from "./utils";
import {ceil} from "lodash-es";
import axios from "axios";
import {Blank} from "./Lift/Blank";
import {ILiftMoveData} from "./Lift/Lift";
import {BuildingContext, ILiftStatus, LiftStatusContext} from "../contexts";
import {useLiftConfigContext} from "../hooks/useLiftConfigContext";
import {useLiftStatusContext} from "../hooks/useLiftStatusContext";

export type FloorProps = {
    numberOfLifts: number,
    numberOfFloors: number,
    floor_level: number,
    floor_name: string,
    numberOfPanels: number,
};

const LabelContainer = styled(Wrapper)`
    //position: absolute;
    //top: 1px;

    font-family: Helvetica, sans-serif;
    font-size: 2em;
    padding: 0.4em 0;
    //background-color: dimgray;
    color: white;

    width: 120px;
    height: 10px;
    line-height: 1em;

`;

export const FloorNumber = styled.span`
    margin-left: 5px;
`;


const Label = ({floor_name}: FloorProps) => {
    return (
        <LabelContainer>
            <FloorNumber> {floor_name}</FloorNumber>
        </LabelContainer>
    );
};

const FloorContainer = styled(Wrapper)`
    background-color: dimgray;

`;
function nextFloor(floor:number, lift_floor:number) {
    console.log('door')
    if (floor === lift_floor) {
        return 'open'
    }
    return 'closed'
}
export default function Floor(props: FloorProps) {

    const liftConfig = useLiftConfigContext()
    const liftStatus = useLiftStatusContext()
    // @ts-ignore
    const {setLiftStatus} = useContext(LiftStatusContext);

    const moveLift = async (lift: number, floor: number) => {
        console.log("move")
        try {
            const liftMovePost: ILiftMoveData = {"lift": lift, "floor": floor}
            await axios.post('http://localhost:8080/api/lift/move', liftMovePost);
        } catch (error) {
            console.error('Error moving lift:', error);
        }

        try {
            const response = await axios.get('http://localhost:8080/api/lift/status');
            console.log(response)
            const data: ILiftStatus = response.data
            setLiftStatus(data)
        } catch (error) {
            console.error('Error fetching LiftStatus config:', error);
        }
    }

    const liftElements = []
    if (liftConfig && liftStatus) {
        const half = ceil(Object.keys(liftConfig["lifts"]).length / 2);
        let i = 1
        let leftLifts = []
        for (const [liftId, config] of Object.entries(liftConfig["lifts"])) {
            if (config["serviced_floors"].includes(props.floor_level)) {
                liftElements.push(
                    <Lift
                        liftId={{floor: props.floor_level, id: Number(liftId)}}
                        currentFloor={liftStatus["lifts"][Number(liftId)]["floor"]}
                        requestedFloors={liftStatus["lifts"][Number(liftId)]["destinations"]}
                        servicedFloors={config["serviced_floors"]}
                        doors={liftStatus["lifts"][Number(liftId)]["floor"] === props.floor_level ? 'open' : 'closed'}
                        clickHandler={moveLift}
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
                        <ControlPanel floor={props.floor_level} leftLifts={leftLifts} floorCount={props.numberOfFloors}></ControlPanel>
                    )
                }
            }
            i += 1;
        }
    }
    return (
        <FloorContainer>
            <Label floor_level={props.floor_level} floor_name={props.floor_name} numberOfPanels={props.numberOfPanels}
                   numberOfLifts={props.numberOfLifts} numberOfFloors={props.numberOfFloors}></Label>
            {liftElements}
        </FloorContainer>
    )
}
