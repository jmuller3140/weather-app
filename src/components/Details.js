import React from 'react';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import PropTypes from 'prop-types';

const Details = (props) => {
    const {main, weather, clouds, wind, rain, snow, dt_txt_local} = props;
    //rain and snow will not work in javascript due to a numeric value in its variable name
    //will keep in to see if there is a way to change in the future
    const pictureSrc = 'http://openweathermap.org/img/w/' + weather[0].icon + '.png';
    const date = new Date(dt_txt_local);
    let hour = date.getHours(date);
    if(parseInt(hour, 10) >= 12){
        if(parseInt(hour, 10) !== 12){
            hour = parseInt(hour, 10) - 12
        }
        hour = hour.toString() + " PM";
    }else if(parseInt(hour, 10) < 1){
        hour = "12 AM";
    }
    else{
        hour = hour.toString() + " AM";
    }
    return(
        <div>
            <MediaQuery query="(min-device-width: 1224px)">
                <Container>
                    <MoonFont>{hour}</MoonFont><br/>
                    <img src={pictureSrc} alt="weather-img"/>
                    <div>{weather[0].description}</div>
                    <div><MoonBold>{main.temp}&#176;</MoonBold></div>
                    <ItemDisplay>
                        <div>Pressure: <MoonFont>{main.pressure}</MoonFont> hPa</div>
                        <div>Sea lvl: <MoonFont>{main.sea_level}</MoonFont> hPa</div>
                        <div>Ground lvl: <MoonFont>{main.grnd_level}</MoonFont> hPa</div>
                        <div>Humidity: <MoonFont>{main.humidity}%</MoonFont></div>
                        <div>Cloudiness: <MoonFont>{clouds.all}%</MoonFont></div>
                        <div>Wind Speed: <MoonFont>{wind.speed} MPH</MoonFont></div>
                        <div>Wind Dir: <MoonFont>{wind.deg}&#176;</MoonFont></div>
                    </ItemDisplay>
                </Container>
            </MediaQuery>
            <MediaQuery query="(max-device-width: 1224px)">
                <ContainerMobile>
                    <MoonFont>{hour}</MoonFont><br/>
                    <img src={pictureSrc} alt="weather-img"/>
                    <div>{weather[0].description}</div>
                    <div><MoonBold>{main.temp}&#176;</MoonBold></div>
                    <ItemDisplay>
                        <div>Pressure: <MoonFont>{main.pressure}</MoonFont> hPa</div>
                        <div>Sea lvl: <MoonFont>{main.sea_level}</MoonFont> hPa</div>
                        <div>Ground lvl: <MoonFont>{main.grnd_level}</MoonFont> hPa</div>
                        <div>Humidity: <MoonFont>{main.humidity}%</MoonFont></div>
                        <div>Cloudiness: <MoonFont>{clouds.all}%</MoonFont></div>
                        <div>Wind Speed: <MoonFont>{wind.speed} MPH</MoonFont></div>
                        <div>Wind Dir: <MoonFont>{wind.deg}&#176;</MoonFont></div>
                    </ItemDisplay>
                </ContainerMobile>
            </MediaQuery>
        </div>
        )
}
Details.propTypes = {
    main: PropTypes.object,
    weather: PropTypes.array,
    clouds: PropTypes.object,
    wind: PropTypes.object,
    rain: PropTypes.object,
    snow: PropTypes.object,
    dt_txt_local: PropTypes.string
}
    const Container = styled.div`
        width: 150px;
        height: 250px;
        display:flex;
        flex-direction:column;
        margin:1em;
        font-family: Moon-Light;
        font-size: 10pt;
        border-radius: 5px;
        border: 1px solid grey;
        align-items:center;
        padding-top:.5em;
    `;
    const ItemDisplay = styled.div`
        padding-top:1em;
        display:flex;
        flex-direction: column;
        align-items: left;
        text-align:left;
        font-family:Raleway-Regular;
    `;
    const MoonFont = styled.span`
        font-family: "Moon-Light";
    `;
    const MoonBold = styled.span`
        font-family: "Moon-Bold";
    `;

    const ContainerMobile = styled.div`
        width: 150px;
        height: 250px;
        margin: .2em;
        display:flex;
        flex-direction:column;
        font-family: Moon-Light;
        font-size: 10pt;
        border-radius: 5px;
        border: 1px solid grey;
        align-items:center;
        padding-top:.5em;
    `;
export default Details;
