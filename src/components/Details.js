import React from 'react';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';

const Details = (props) => {
    const {main, weather, clouds, wind, rain, snow, dt_txt_local} = props;
    const pictureSrc = 'http://openweathermap.org/img/w/' + weather[0].icon + '.png';
    const date = new Date(dt_txt_local);
    let hour = date.getHours(date);
    if(parseInt(hour) >= 12){
        if(parseInt(hour) !== 12){
            hour = parseInt(hour) - 12
        }
        hour = hour.toString() + " PM";
    }else if(parseInt(hour) < 1){
        hour = "12 AM";
    }
    else{
        hour = hour.toString() + " AM";
    }
    return(
        <div>
            <MediaQuery query="(min-device-width: 1224px)">
                <Container>
                    <MoonFont>{hour}</MoonFont>
                    <img src={pictureSrc} alt="weather-img"/>
                    <div>{weather[0].description}</div>
                    <div><MoonBold>{main.temp}&#176;</MoonBold></div>
                    <ItemDisplay>
                        <div>Pressure: <MoonFont>{main.pressure}</MoonFont> hPa</div>
                        <div>Sea lvl: <MoonFont>{main.sea_level}</MoonFont> hPa</div>
                        <div>Ground lvl: <MoonFont>{main.grnd_level}</MoonFont> hPa</div>
                        <div>Humidity: <MoonFont>{main.humidity}%</MoonFont></div>
                    </ItemDisplay>
                </Container>
            </MediaQuery>
            <MediaQuery query="(max-device-width: 1224px)">
                <ContainerMobile>
                    <MoonFont>{hour}</MoonFont>
                    <img src={pictureSrc} alt="weather-img"/>
                    <div>{weather[0].description}</div>
                    <div><MoonBold>{main.temp}&#176;</MoonBold></div>
                    <ItemDisplay>
                        <div>Pressure: <MoonFont>{main.pressure}</MoonFont> hPa</div>
                        <div>Sea lvl: <MoonFont>{main.sea_level}</MoonFont> hPa</div>
                        <div>Ground lvl: <MoonFont>{main.grnd_level}</MoonFont> hPa</div>
                        <div>Humidity: <MoonFont>{main.humidity}%</MoonFont></div>
                    </ItemDisplay>
                </ContainerMobile>
            </MediaQuery>
        </div>
        )
}
    const Container = styled.div`
        width: 150px;
        height: 200px;
        display:flex;
        flex-direction:column;
        margin:1em;
        font-family: Raleway-Regular;
        font-size: 10pt;
        border-radius: 5px;
        border: 1px solid grey;
        align-items:center;
        padding-top:.5em;
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

    const ContainerMobile = styled.div`
        width: 150px;
        height: 200px;
        display:flex;
        flex-direction:column;
        font-family: Raleway-Regular;
        font-size: 10pt;
        border-radius: 5px;
        border: 1px solid grey;
        align-items:center;
        padding-top:.5em;
    `;
export default Details;
