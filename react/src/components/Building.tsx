import styled from "styled-components";
import Floor from "./Floor";

import React, {useEffect, useState} from 'react';
import {IBuildingConfigFloor, IBuildingProps, ILiftConfig} from "../App";
import axios from "axios";
import {ILiftMoveData} from "./Lift/Lift";

export interface IBuildingContext {
    liftMovement: boolean;
    setLiftMovement: React.Dispatch<React.SetStateAction<boolean>>;
}
export const BuildingContext = React.createContext<IBuildingContext | null>(null);
const BuildingContainer = styled.div`
    background-color: dimgray;
    overflow: auto;

`;

export interface ILiftStatus {
    lifts: {
        [key: number]: {
            "floor": number,
            "destinations": number[]
        };
    };
}

export interface ILiftDirection {
    lifts: {
        [key: number]: {
            "direction": string
        };
    };
}

export type FloorProps = {
    numberOfLifts: number,
    numberOfFloors: number,
    floor_level: number,
    floor_name: string,
    numberOfPanels: number,
    maxPanels: number
    liftConfig: ILiftConfig,
    liftStatus: ILiftStatus,
    liftButtonHandler: (lift: number, floor: number) => void;
};


export default function Building(props: IBuildingProps) {

    const initLiftStatus = {
        lifts: {}
    }
    const [liftMovement, setLiftMovement] = useState(false);
    function moveLift(lift: number, floor: number) {
        console.log(`move lift: ${lift}, from floor: ${floor}`);
        console.log(`liftStatus x: ${liftStatus["lifts"][Number(lift)]["destinations"]}`);
        const destinations = liftStatus["lifts"][Number(lift)]["destinations"];
        let nextFloor: number | undefined;
        nextFloor = destinations.pop();

        if (nextFloor !== undefined) {
            try {
                console.log(`move lift: ${lift}, to floor: ${nextFloor}`);
                const liftMovePost: ILiftMoveData = {"lift": lift, "floor": nextFloor}
                axios.post('http://127.0.0.1:8000/api/building/move', liftMovePost);
            } catch (error) {
                console.error('Error moving lift:', error);
            }

            setLiftMovement(prevState => !prevState)
        }
    }

    const [liftStatus, setLiftStatus] = useState<ILiftStatus>(initLiftStatus);

    useEffect(() => {
        console.log("initLiftStatus")
        async function fetchLiftStatus() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/lift/status');
                console.log(response)
                const data: ILiftStatus = response.data
                setLiftStatus(data)
            } catch (error) {
                console.error('Error fetching LiftStatus config:', error);
            }
        }
        fetchLiftStatus();
    }, [liftMovement]);

    let maxPanels = 0

    props.buildingConfig["floors"].map((floor: IBuildingConfigFloor) => {
        maxPanels = Math.max(maxPanels, floor.panels);
    });
    const floorElements = props.buildingConfig["floors"].map((floor: IBuildingConfigFloor) => {
        return <Floor key={floor.level}
                      numberOfLifts={props.buildingConfig["numberOfLifts"]}
                      floor_level={floor.level}
                      floor_name={floor.name}
                      numberOfPanels={floor.panels}
                      maxPanels={maxPanels}
                      numberOfFloors={props.buildingConfig["floors"].length}
                      liftConfig={props.liftConfig}
                      liftStatus={liftStatus}
                      liftButtonHandler={moveLift}
        />
    })
    console.log(`maxPanels: ${maxPanels}`);
    return (
         <BuildingContext.Provider value={{liftMovement, setLiftMovement}}>
            <BuildingContainer>
                {floorElements}
            </BuildingContainer>
        </BuildingContext.Provider>
    )
}
