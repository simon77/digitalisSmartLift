import {useContext} from 'react';
import {BuildingContext, IBuildingConfig} from '../contexts';

export function useBuildingContext(): IBuildingConfig {
    const context = useContext(BuildingContext);
    if (context === null) throw new ReferenceError('BuildingContext not initialised!');
    return context;
}
