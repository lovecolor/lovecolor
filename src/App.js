import React, { useEffect, useState } from "react";
import Airtable from "airtable";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";


const base = new Airtable({ apiKey: "keyd4WWrMKp1ZmbwC" }).base("appNB4LHqQ4XK6OCM");

const StyledH1 = styled.h1`
  text-align: center;
  font-size: 4rem;
  margin: 1rem 0;
`;
const StyledGoal = styled.div`
  padding: 1rem;
  margin-bottom: 2rem;

  h2 {
    display: inline;
    font-size: 3rem;
    padding: 1rem 5rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  h3:last-of-type {
    margin-top: 1rem;
  }
`;
const StyledCheckBox = styled.label`
  display: block;
  position: relative;
  user-select: none;

  input {
    display: none;

    &:checked ~ span {
      background: #754dff;

      &::after {
        display: block;
      }
    }
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    height: 3rem;
    width: 3rem;
    background: #dacfff;
    transition: background 0.3s ease;

    &::after {
      content: "";
      position: absolute;
      left: 1rem;
      width: 0.8rem;
      height: 2rem;
      border: solid white;
      border-width: 0 4px 4px 0;
      transform: rotate(45deg);
      display: none;
    }
  }
`;
const StyledGoalDetails = styled.div`
  padding: 2rem;
  background: #dacfff;
`;
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #eee;
  }

  #root {
    width: 80%;
    margin: 0 auto;
    font-family: "Do Hyeon", sans-serif;
    color: #272727;
  }
`;
const Goal = ({ goal, updates }) => {
  return (
    <StyledGoal>
      <StyledCheckBox>
        {" "}
        <input type="checkbox" defaultChecked={goal.fields.complete} disabled />
        <span />
      </StyledCheckBox>
      <h2>{goal.fields.title}</h2>
      <StyledGoalDetails>
        <h3>DETAILS</h3>
        <p>{goal.fields.details}</p>
        <h3>UPDATES</h3>
        {updates.map((update, index) => (
          <p key={index}>{update.fields.update}</p>
        ))}
      </StyledGoalDetails>
    </StyledGoal>
  );
};
function App() {
  const [goals, setGoals] = useState([]);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    base("goals")
      .select({ view: "Grid view" })
      .eachPage((records, fetchNextPage) => {
        setGoals(records);
        fetchNextPage();
      });
    base("updates")
      .select({ view: "Grid view" })
      .eachPage((records, fetchNextPage) => {
        setUpdates(records);
        fetchNextPage();
      });
  }, []);

  return (
    <>
      <GlobalStyle />
      <StyledH1>My Goals</StyledH1>
      {goals.map((goal) => (
        <Goal
          key={goal.id}
          goal={goal}
          updates={updates.filter(
            (update) => update.fields.goalid[0] === goal.id
          )}
        />
      ))}
    </>
  );
}

export default App;
