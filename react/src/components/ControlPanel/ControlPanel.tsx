import React, {useEffect, useState} from 'react';
import ControlPanelDisplay from "./ControlPanelDisplay";
import styled from "styled-components";
import {Wrapper} from "../utils";
import {PanelButtons} from "./PanelButtons";
import axios from "axios";
import {BuildingContext} from "../Building";

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
    // @ts-ignore
    const {liftMovement, setLiftMovement} = React.useContext(BuildingContext);

    const [liftToUse, setLiftToUse] = useState(0);
    const [arrowDirection, setArrowDirection] = useState<TLiftDirection>();
    const sendLiftRequest = async (floor: number, floorIndex: number) => {
        try {
            const liftRequestPost: ILiftRequestData = {"from_floor": floor, "to_floor": floorIndex}
            const response = await axios.post('http://127.0.0.1:8000/api/lift/request', liftRequestPost);
            console.log(response)
            console.log(props.leftLifts)
            console.log(props.leftLifts.includes(response.data["lift"]))
            if (props.leftLifts.includes(response.data["lift"])) {
                // @ts-ignore
                setArrowDirection('left')
            } else {
                // @ts-ignore
                setArrowDirection('right')
            }
            setLiftToUse(response.data["lift"])
            setLiftMovement((prevState: boolean) => !prevState)

        } catch (error) {
            console.error('Error requesting lift:', error);
        }
    };
    useEffect(() => {
    }, [liftToUse]);

    return (
        <PanelContainer>
            <Wrapper>
                <ControlPanelDisplay liftToUse={liftToUse} direction={arrowDirection}></ControlPanelDisplay>
                <PanelButtons
                    current_floor={props.floor}
                    floorCount={props.floorCount}
                    clickHandler={sendLiftRequest}
                ></PanelButtons>
            </Wrapper>
        </PanelContainer>
    )
}
