import {useContext} from 'react';
import {LiftConfigContext, ILiftConfig} from '../contexts';

export function useLiftConfigContext(): ILiftConfig {
    const context = useContext(LiftConfigContext);
    if (context === null) throw new ReferenceError('BuildingContext not initialised!');
    return context;
}
