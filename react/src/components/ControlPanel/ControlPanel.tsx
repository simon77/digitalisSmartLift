import React, {useEffect, useState} from 'react';
import ControlPanelDisplay from "./ControlPanelDisplay";
import styled from "styled-components";
import {Wrapper} from "../utils";
import {PanelButtons} from "./PanelButtons";
import axios from "axios";

export interface IControlPanelProps {
    floor: number
    floorCount: number
    leftLifts: number[]
}

type TLiftDirection = {
    direction?: 'left' | 'right'
}

export interface IPanelDisplay {
    liftToUse: number;
    direction?: TLiftDirection;
}

export interface IPanelButtons {
    current_floor: number,
    floorCount: number,
    clickHandler: (floor: number, floorIndex: number) => void;
}

const PanelContainer = styled(Wrapper)`
    width: 12em;
    height: 15em;
    position: relative;
    background-color: dimgray;
`;

interface ILiftRequestData {
    "from_floor": number,
    "to_floor": number
}


export default function ControlPanel(props: IControlPanelProps) {

    const [liftToUse, setLiftToUse] = useState(0);
    const [liftDirection, setLiftDirection] = useState<TLiftDirection>();
    const sendLiftRequest = async (floor: number, floorIndex: number) => {
        try {
            const liftRequestPost: ILiftRequestData = {"from_floor": floor, "to_floor": floorIndex}
            const response = await axios.post('http://localhost:8080/api/lift/request', liftRequestPost);
            console.log(response)
            console.log(props.leftLifts)
            console.log(props.leftLifts.includes(response.data["lift"]))
            if (props.leftLifts.includes(response.data["lift"])) {
                // @ts-ignore
                setLiftDirection('left')
            } else {
                // @ts-ignore
                setLiftDirection('right')
            }
            setLiftToUse(response.data["lift"])

        } catch (error) {
            console.error('Error requesting lift:', error);
        }
    };
    useEffect(() => {

    }, [liftToUse, liftDirection]);

    return (
        <PanelContainer>
            <Wrapper>
                <ControlPanelDisplay liftToUse={liftToUse} direction={liftDirection}></ControlPanelDisplay>
                <PanelButtons
                    current_floor={props.floor}
                    floorCount={props.floorCount}
                    clickHandler={sendLiftRequest}
                ></PanelButtons>
            </Wrapper>
        </PanelContainer>
    )
}
