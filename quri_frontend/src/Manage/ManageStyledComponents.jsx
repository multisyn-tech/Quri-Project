import styled from 'styled-components'
import {  Label } from 'reactstrap'


export const InputContainer = styled.div`
    margin-bottom: ${props => props?.marginBottom || '20px'};
    margin-left: ${props => props?.marginLeft};
    margin-right: ${props => props?.marginRight};
    margin-top: ${props => props?.marginTop};
    width: ${props => props?.width};
`;
export const InputLabel = styled(Label)`
    font-size: 14px;
`;