import {createContext, ReactChild, ReactFragment, ReactPortal, useEffect, useState} from "react";
import axios from "axios";

export interface ILiftConfig {
    lifts: {
        [key: number]: {
            serviced_floors: number[];
        };
    };
}

export const LiftConfigContext = createContext<ILiftConfig | null>(null);


export const LiftConfigContextProvider = (props: {
    children: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined;
}) => {
    const [liftConfig, setLiftConfig] = useState<ILiftConfig | null>();

    useEffect(() => {
        async function fetchLiftConfig() {
            try {
                const response = await axios.get('http://localhost:8080/api/lift/config');
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
        <LiftConfigContext.Provider value={liftConfig ? liftConfig: null}>
            {props.children}
        </LiftConfigContext.Provider>
    );
};
