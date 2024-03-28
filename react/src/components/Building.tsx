import styled from "styled-components";
import Floor from "./Floor";

import React, {useContext} from 'react';
import {BuildingContext, IBuildingConfig, IBuildingConfigFloor} from "../contexts";


const BuildingContainer = styled.div`
    background-color: dimgray;
    overflow: auto;

`;

export default function Building() {
    const buildingConfig = useContext<IBuildingConfig | null>(BuildingContext);
    if (buildingConfig) {
        const floorElements = buildingConfig["floors"].map((floor: IBuildingConfigFloor) => {
            return <Floor numberOfLifts={buildingConfig["numberOfLifts"]} floor_level={floor.level} floor_name={floor.name}
                          numberOfPanels={floor.panels} numberOfFloors={buildingConfig["floors"].length}/>
        })
        return (
            <BuildingContainer>
                {floorElements}
            </BuildingContainer>
        )
    }
    return (
        <BuildingContainer>
        </BuildingContainer>
        )

}
