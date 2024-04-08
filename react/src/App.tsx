import React, {useEffect, useState} from 'react';
import Building from "./components/Building";

import axios from "axios";

export interface IBuildingConfigFloor {
    level: number,
    name: string,
    panels: number
}

export interface IBuildingConfig {
    numberOfLifts: number,
    floors: IBuildingConfigFloor[],
}

export interface ILiftConfig {
    lifts: {
        [key: number]: {
            serviced_floors: number[];
        };
    };
}

export interface IBuildingProps {
    buildingConfig: IBuildingConfig;
    liftConfig: ILiftConfig;
}
export const App = () => {
    const initBuildingConfig = {
        numberOfLifts: 0,
        floors: []
    }
    const [buildingConfig, setBuildingConfig] = useState<IBuildingConfig>(initBuildingConfig);

    useEffect(() => {
        async function fetchBuildingConfig() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/building/config');
                console.log(response)
                const data: IBuildingConfig = response.data
                setBuildingConfig(data)
            } catch (error) {
                console.error('Error fetching building config:', error);
            }
        }
        fetchBuildingConfig();
    }, []);

    const initLiftConfig = {
        lifts: {}
    }
    const [liftConfig, setLiftConfig] = useState<ILiftConfig>(initLiftConfig);

    useEffect(() => {
        async function fetchLiftConfig() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/lift/config');
                console.log(response)
                const data: ILiftConfig = response.data
                setLiftConfig(data)
            } catch (error) {
                console.error('Error fetching lift config:', error);
            }
        }
        fetchLiftConfig();
    }, []);

    return (
        <Building buildingConfig={buildingConfig} liftConfig={liftConfig}/>
    );
};
