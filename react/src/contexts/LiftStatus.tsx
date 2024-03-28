import {createContext, ReactChild, ReactFragment, ReactPortal, useEffect, useState} from "react";
import axios from "axios";

export interface ILiftStatus {
    lifts: {
        [key: number]: {
            "floor": number,
            "destinations": number[]
        };
    };
}

export interface ILiftDoorStatus {
    lifts: {
        [key: number]: {
            "floor": number,
            "destinations": number[],
            "door": string | null,
            "direction": string | null,
        };
    };
}

export interface ILiftStatusContext {
    liftStatus: ILiftStatus | null | undefined;
    // liftDoor: ILiftDoorStatus;
    setLiftStatus: React.Dispatch<React.SetStateAction<ILiftStatus | null | undefined>>;
}

export const LiftStatusContext = createContext<ILiftStatusContext | null>(null);


export const LiftStatusContextProvider = (props: {
    children: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined;
}) => {
    const [liftStatus, setLiftStatus] = useState<ILiftStatus | null>();
    // const liftDoor: ILiftDoorStatus = liftStatus

    useEffect(() => {
        async function fetchLiftStatus() {
            try {
                const response = await axios.get('http://localhost:8080/api/lift/status');
                console.log(response)
                const data: ILiftStatus = response.data
                setLiftStatus(data)
            } catch (error) {
                console.error('Error fetching LiftStatus config:', error);
            }
        }

        fetchLiftStatus();
    }, []);

    return (
        <LiftStatusContext.Provider value={{liftStatus, setLiftStatus}}>
            {props.children}
        </LiftStatusContext.Provider>
    );
};
