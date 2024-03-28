import React from 'react';
import styled from 'styled-components';
import {Wrapper} from '..';

type LabelProps = { id: number };

const LabelContainer = styled(Wrapper)`
  position: absolute;
  top: 1px;

  font-family: Helvetica,sans-serif;
  font-size: 2em;
  padding: 0.4em 0;
  color: black;

  width: 10px;
  height: 10px;
  line-height: 1em;
    
`;

const LiftNumber = styled.span`
  margin-left: 5px;
`;

export const Label = ({id}: LabelProps) => {
    return (
        <LabelContainer>
            <LiftNumber> {id}</LiftNumber>
        </LabelContainer>
    );
};
