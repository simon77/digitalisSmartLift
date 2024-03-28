import {createContext, ReactChild, ReactFragment, ReactPortal, useEffect, useState} from "react";
import axios from "axios";

export interface IBuildingContext {
    floorCount: number;
    lifts: number[];
}

export interface IBuildingConfigFloor {
    level: number,
    name: string,
    panels: number
}

export interface IBuildingConfig {
    numberOfLifts: number,
    floors: IBuildingConfigFloor[],
}

export const BuildingContext = createContext<IBuildingConfig | null>(null);


export const BuildingContextProvider = (props: {
    children: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined;
}) => {
    const [buildingConfig, setBuildingConfig] = useState<IBuildingConfig | null>();

    useEffect(() => {
        async function fetchBuildingConfig() {
            try {
                const response = await axios.get('http://localhost:8080/api/building/config');
                console.log(response)
                const data: IBuildingConfig = response.data
                setBuildingConfig(data)
            } catch (error) {
                console.error('Error fetching building config:', error);
            }
        }
        fetchBuildingConfig();
    }, []);

    return (
        <BuildingContext.Provider value={buildingConfig ? buildingConfig: null}>
            {props.children}
        </BuildingContext.Provider>
    );
};
