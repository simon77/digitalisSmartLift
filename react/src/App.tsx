import React from 'react';
import Building from "./components/Building";

import {BuildingContextProvider, LiftConfigContextProvider, LiftStatusContextProvider} from "./contexts";

export const App = () => {
    return (
        <BuildingContextProvider>
            <LiftConfigContextProvider>
                <LiftStatusContextProvider>
                    <Building/>
                </LiftStatusContextProvider>
            </LiftConfigContextProvider>
        </BuildingContextProvider>
    );
};
