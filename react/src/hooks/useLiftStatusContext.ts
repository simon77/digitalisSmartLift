import {useContext} from 'react';
import {LiftStatusContext, ILiftStatus} from '../contexts';

export function useLiftStatusContext(): ILiftStatus {
    // @ts-ignore
    const {liftStatus} = useContext(LiftStatusContext);
    if (liftStatus === null) throw new ReferenceError('BuildingContext not initialised!');
    return liftStatus;
}
