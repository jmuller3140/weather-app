import React from 'react';
import styled from 'styled-components';

const Day = (props) => {
    const {forcastDay, maxTemp, minTemp, getDetails, hour, weatherIcon, weatherDescription} = props;
    const pictureSrc = 'http://openweathermap.org/img/w/' + weatherIcon + '.png';
    const day = forcastDay.slice(0,3);
    return(
        <Container onClick={(e) => getDetails(e, hour, forcastDay)}>
            <MoonFont>{day}</MoonFont>
            <img src={pictureSrc} />
            <div>{weatherDescription}</div>
            <ItemDisplay>
                <MoonBold>{maxTemp}&#176;</MoonBold>
                <div>{minTemp}&#176;</div>
            </ItemDisplay>
        </Container>
        )
}
    const Container = styled.div`
            width: 150px;
            height: 200px;
            display:flex;
            flex-direction:column;
            margin:1em;
            font-family: Moon-Light;
            font-size: 10pt;
            border-radius: 5px;
            border: 1px solid grey;
            align-items:center;
            cursor: pointer;
        `;
    const ItemDisplay = styled.div`
            display:flex;
            flex-direction: column;
            align-items: left;
            text-align:left;
        `;
    const MoonFont = styled.span`
        font-family: "Moon-Light";
    `;
    const MoonBold = styled.span`
        font-family: "Moon-Bold";
    `;
export default Day;
