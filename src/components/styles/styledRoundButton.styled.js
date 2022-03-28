import styled from "styled-components";
export const StyledRoundButton = styled.button`
  padding: 2vh;
  border: none;
  font-weight: bold;
  font-size: 1.5rem;
  color: #ffffff;
  width: 3vh;
  height: 3vh;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background:transparent;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;