import React from 'react';
import styled, { keyframes } from 'styled-components';

const Day = (props) => {
    const {forcastDay, maxTemp, minTemp, getDetails, hour, weatherIcon, weatherDescription, onHover} = props;
    const pictureSrc = 'http://openweathermap.org/img/w/' + weatherIcon + '.png';
    console.log(onHover);
    const day = forcastDay.slice(0,3);
    return(
        <Container onClick={(e) => getDetails(e, hour, forcastDay)} onMouseOver={(e) => onHover(e, weatherIcon)}>
            <MoonFont>{day}</MoonFont>
            <img src={pictureSrc} alt="weather-img"/>
            <div>{weatherDescription}</div>
            <ItemDisplay>
                <MoonBold>{maxTemp}&#176;</MoonBold>
                <div>{minTemp}&#176;</div>
            </ItemDisplay>
        </Container>
        )
}
    const TransitionIn = keyframes`
        0% { color: transparent; }
        100% { color: radboats; }
        }
    `;
    const Container = styled.div`
            animation: ${TransitionIn} 1s .1s both;
            width: 150px;
            height: 200px;
            display:flex;
            flex-direction:column;
            margin:1em;
            font-family: Moon-Light;
            font-size: 10pt;
            border-radius: 5px;
            border: 1px solid grey;
            justify-content:center;
            align-items:center;
            cursor: pointer;
        `;
    const ItemDisplay = styled.div`
            animation: ${TransitionIn} 1s 1s both;
            display:flex;
            flex-direction: column;
            align-items: left;
            text-align:left;
        `;
    const MoonFont = styled.span`
     animation: ${TransitionIn} 1s 1s both;
        font-family: "Moon-Light";
    `;
    const MoonBold = styled.span`
     animation: ${TransitionIn} 1s 1s both;
        font-family: "Moon-Bold";
    `;
export default Day;
