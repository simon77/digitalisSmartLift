import React from 'react';
import styled from 'styled-components';
import {Wrapper} from '..';




const ElevatorWrapper = styled(Wrapper)`
    width: 12em;
    height: 15em;

    position: relative;
    background-color: dimgray;

    transition: all 0.5s;

`;

export const Blank = () => {
    return (
        <ElevatorWrapper>
            <Wrapper>

            </Wrapper>
        </ElevatorWrapper>
    );
};
