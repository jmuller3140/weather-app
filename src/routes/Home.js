import React from 'react';

import styled, {keyframes} from 'styled-components';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import request from 'superagent';
import moment from 'moment-timezone';
import Spinner from 'react-spinkit';
import MediaQuery from 'react-responsive';
import { withStyles } from '@material-ui/core/styles';

import Footer from '../components/Footer';
import Day from '../components/Day';
import Details from '../components/Details';
import jsonData from '../json/citylist.json';
import rain from '../imgs/rain.png';
import clear from '../imgs/clear.png';
import mist from '../imgs/mist.png';
import snow from '../imgs/snow.png';
import cloud from '../imgs/cloudy.png';

class Home extends React.Component {
    constructor(){
        super()
        this.renderInputComponent = this.renderInputComponent.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
        this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
        this.getDetails = this.getDetails.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.getTempArray = this.getTempArray.bind(this);
        this.setTimeZone = this.setTimeZone.bind(this);
        this.onHoverBackgroundChange = this.onHoverBackgroundChange.bind(this);
        this.state = { value: '', suggestions: [], forcastDisplay: [], forcastIndepth: "", timezone: "", isLoading: false, backgroundImg: "", backgroundPrevious: "", error: false, units: "F"}
        this.suggestionsList = [];
        this.cityId = 0;
        this.lastInputLength = 0;
        this.timezone = "";
    }
////////////////////////////////////////////////
////////// handler for Material UI suggestion///
////////////////////////////////////////////////
    handleSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: this.getSuggestions(value),
        });
      };
////////////////////////////////////////////////
////////// handler for Material UI clear////////
////////////////////////////////////////////////
    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
  };
////////////////////////////////////////////////
/////// handler for Material UI input Value ////
////////////////////////////////////////////////
      handleChange = (event, { newValue }) => {
        this.setState({ value: newValue });
      };

////////////////////////////////////////////////
/////// adds material UI text field for input///
////////////////////////////////////////////////
      renderInputComponent = (inputProps) => {
        return (<InputComponent inputProps={inputProps} />
            );
    }
////////////////////////////////////////////////
/////// renders the suggestions ////////////////
////////////////////////////////////////////////
     renderSuggestion = suggestion => {
        return(
            <div>
                {suggestion.name}, {suggestion.country}
            </div>)
    };
////////////////////////////////////////////////
/////// cancels weather details screen /////////
////////////////////////////////////////////////
    onClickCancel(action, e){
        if(action === "Forcast"){
            this.setState({forcastIndepth: ""});
        }else if(action === "Error"){
            this.setState({error: false});
        }
    else{
            e.stopPropagation();
        }
    }
////////////////////////////////////////////////
/////// changes temp conversion ////////////////
////////////////////////////////////////////////
    onClickTempChange(e){
        e.stopPropagation();
        if(this.state.units === "F"){
            this.setState({units: "C"});
        }else {
            this.setState({units: "F"});
        }
    }
////////////////////////////////////////////////
/////// cancels weather details screen /////////
////////////////////////////////////////////////
    onHoverBackgroundChange(e, url){
        const num = parseInt(url.slice(0,2), 10);
        let picture = "";
        if(num < 2){
            picture = 'clear';
        } else if(num >= 2 && num < 5){
            picture = 'cloud';
        } else if(num >= 9 && num < 12){
            picture = 'rain';
        } else if(num === 13){
            picture = 'snow';
        }else if(num === 50){
            picture = 'mist';
        }
        this.setState({backgroundPrevious: this.state.backgroundImg})
        this.setState({backgroundImg: picture});
    }
////////////////////////////////////////////////
/////// gets weather details for specific day //
////////////////////////////////////////////////
    getDetails = (e, value, date) => {
        const forcastDetails = this.getForcastDetails(value, date);
        this.setState({forcastIndepth: forcastDetails});
    }
////////////////////////////////////////////////
/////// creates the suggestion list ////////////
////////////////////////////////////////////////
    getSuggestions = value => {
        const inputValue = value.toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
        this.lastInputLength = inputLength;
        return inputLength === 0 ? [] : this.suggestionsList.filter(suggestion => {
            const nameCountry = suggestion.name + ", " +suggestion.country;
            const keep = count < 5 && nameCountry.toLowerCase().slice(0, inputLength) === inputValue;
            if(keep) {
                count += 1;
            }
            return keep;
        });
    }
////////////////////////////////////////////////
//returns the value when suggestion is clicked//
////////////////////////////////////////////////
    getSuggestionValue = (suggestion) => {
        this.cityId = suggestion.id;
      return suggestion.name + ', '+ suggestion.country;
    }
////////////////////////////////////////////////
/////// creates forcast detail popup  //////////
////////////////////////////////////////////////
    getForcastDetails = (forcastDetails, date) => {
            let key = 0;
            let forcast = forcastDetails.map( hour => {
                let props = {key: key, ...hour};
                key++;
                return (<Details {...props} />)
                });
            return (
                    <ForcastDetailsContainer>
                        <p>{date}</p>
                        <ForcastDetailsItem>
                            {forcast}
                        </ForcastDetailsItem>
                    </ForcastDetailsContainer>)
    }
////////////////////////////////////////////////
/////// API call for 5 day weather information//
////////////////////////////////////////////////
    getWeather = (e) => {
        e.preventDefault();
        this.setState({isLoading: true});
        this.setState({forcastDisplay: []});
        this.setState({backgroundImg: ""});
        this.setState({backgroundPrevious: ""});
        //units = metric for
        //no parms for K
        //units imperial for F
        let unit = "";
        if(this.state.units === "F"){
            unit = "imperial"
        }else{
            unit = "metric"
        }
        let address = process.env.REACT_APP_URL_OWM_FIVE;
        let that=this;
        request
        .get(address)
        .query({'id': this.cityId})
        .query({'APPID': process.env.REACT_APP_OWM_APPID})
        .query({'units': unit})
        .set('Accept', 'application/json')
        .then( res => {
            let json = JSON.parse(res.text);
            json["getDetails"] = this.getDetails;
            json["onHoverBackgroundChange"] = this.onHoverBackgroundChange;
            this.runner(json.city.coord, json).then(function(data){
                that.setState({forcastDisplay: data});
                that.setState({isLoading: false});
            })
        })
        .catch( err => {
            that.setState({isLoading: false});
            that.setState({error: true});
            console.log("There was an error in getWeather:" + err);
        });
    }
////////////////////////////////////////////////
/////// runner for the async Timezone api call//
////////////////////////////////////////////////
    runner(coord, json){
        return this.setTimeZone(coord, json)
            .then(this.getTempArray)
            .then(this.getForcast)
            .catch(err => console.log("There was an error: " + err))
    }
////////////////////////////////////////////////
///API call to find and sets timezone for city /
////////////////////////////////////////////////
    setTimeZone(coord, json){
        return new Promise((resolve, reject) => {
            let address = process.env.REACT_APP_URL_TIMEZONEDB;
            const {lat, lon} = coord;
            let that = this;
            request
            .get(address)
            .query({'key': process.env.REACT_APP_TIMEZONEDB_APPID})
            .query({'by': 'position'})
            .query({'lat': lat})
            .query({'lng': lon})
            .query({'format': 'json'})
            .set('Accept', 'application/json')
            .then( res => {
                let timeZoneDetails = JSON.parse(res.text);
                let timezone = timeZoneDetails.zoneName;
                resolve({timezone: timezone, details: json})
            })
            .catch(err => {
                console.log("There was an error in setTimeZone:" + err);
                that.setState({isLoading: false});
                that.setState({error: true});
            });
        })
    }
//////////////////////////////////////////////////////
//creates 5 day forcast and divides info into days////
//////////////////////////////////////////////////////
    getTempArray(json) {
        return new Promise((resolve, reject) => {
            let tempArray = [];
            let dayArray = [];
            let previousDayString = "";
            let max_temp = 0;
            let min_temp = 0;
            let weatherIcon = "";
            let weatherDescription = "";
            try{
                for(var i = 0; i < json.details.cnt; i++){
                const date = moment.unix(json.details.list[i].dt).utc();
                let convertedDate = date.tz(json.timezone).format('YYYY-MM-DD HH:mm');
                json.details.list[i].dt_txt_local = convertedDate.toString();
                let forcastDay = date.toString().slice(0, 15);
                const convertedHour = date.tz(json.timezone).hour();

                if(convertedHour === 11 || convertedHour === 12 || convertedHour === 13){
                    weatherIcon = json.details.list[i].weather[0].icon;
                    weatherDescription = json.details.list[i].weather[0].description;
                }
                if(i === 0 ){
                    if(convertedHour > 13){
                        weatherIcon = json.details.list[i].weather[0].icon;
                        weatherDescription = json.details.list[i].weather[0].description;
                    }
                    previousDayString = forcastDay;
                    max_temp = json.details.list[i].main.temp_max;
                    min_temp = json.details.list[i].main.temp_min;
                    dayArray.push(json.details.list[i]);
                } else if(forcastDay !==  previousDayString){
                    tempArray.push({hour: dayArray, maxTemp: max_temp, minTemp: min_temp, forcastDay: previousDayString, weatherIcon: weatherIcon, weatherDescription: weatherDescription});
                    dayArray = [];
                    max_temp = json.details.list[i].main.temp_max;
                    min_temp = json.details.list[i].main.temp_min;
                    previousDayString = forcastDay;
                    dayArray.push(json.details.list[i]);
                } else{
                    if(max_temp < json.details.list[i].main.temp_max){
                        max_temp = json.details.list[i].main.temp_max;
                    }
                    if(min_temp > json.details.list[i].main.temp_min){
                        min_temp = json.details.list[i].main.temp_min;
                    }
                    dayArray.push(json.details.list[i]);
                }
            }
                tempArray.push({hour: dayArray, maxTemp: max_temp, minTemp: min_temp, forcastDay: previousDayString, weatherIcon: weatherIcon, weatherDescription: weatherDescription});
                resolve({tempArray: tempArray, getDetails: json.details.getDetails, onHoverBackgroundChange: json.details.onHoverBackgroundChange});
            }
            catch(err){
                console.log("There was an error in getTempArray:" + err);
                this.setState({isLoading: false});
                this.setState({error: true});
                reject({err: err});
            }
        })
    }
////////////////////////////////////////////////
/////// creates days from getTempArray /////////
////////////////////////////////////////////////
    getForcast(forcastInfo) {
        return new Promise((resolve, reject) => {
            try{
                let key = 0;
                let forcast = forcastInfo.tempArray.map( day => {
                let props = {key: key, getDetails: forcastInfo.getDetails, hour: day.hour, maxTemp: day.maxTemp, minTemp: day.minTemp, forcastDay: day.forcastDay, weatherIcon: day.weatherIcon, weatherDescription: day.weatherDescription, onHover: forcastInfo.onHoverBackgroundChange};
                key++;
                return (<Day {...props} />)
                });
                resolve(
                    <div>
                        <MediaQuery query="(min-width: 1224px)">
                            <ForcastFiveDay>
                                {forcast}
                            </ForcastFiveDay>
                        </MediaQuery>
                        <MediaQuery query="(max-width: 1224px)">
                            <ForcastFiveDayMobile>
                                {forcast}
                            </ForcastFiveDayMobile>
                        </MediaQuery>
                    </div>
                    )
                }
                catch(err){
                console.log("There was an error in getForcast:" + err);
                this.setState({isLoading: false});
                this.setState({error: true});
                reject(<div></div>)
            }
        })
    }
////////////////////////////////////////////////
//// setting the json city code data  //////////
////////////////////////////////////////////////
    componentDidMount = () => {
        this.suggestionsList = jsonData;
      };
////////////////////////////////////////////////
/////// renders the jsx/ ///////////////////////
////////////////////////////////////////////////
  render() {
    const { classes } = this.props;
    const inputProps = {
      classes,
      placeholder: 'Type a city',
      value: this.state.value,
      onChange: this.handleChange
    };
    return (
        <div>
         <MediaQuery query="(min-width: 1224px)">
            <ComponentContainer>
           <WeatherContainer>
            <p>Where would you like to check the weather?</p>
            <SuggestionContainer>
                <Autosuggest
                        renderInputComponent={this.renderInputComponent}
                        suggestions={this.state.suggestions}
                        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        inputProps={inputProps}
                        theme={{
                            container: classes.container,
                            suggestionsContainerOpen: classes.suggestionsContainerOpen,
                            suggestionsList: classes.suggestionsList,
                            suggestion: classes.suggestion,
                        }}
                />
                <Button color="primary" variant="text" onClick={(e)=>{this.onClickTempChange(e)}} size="small" disableRipple={true} disableFocusRipple={true} className={classes.buttonUnits}>{this.state.units}&#176;</Button>
            </SuggestionContainer>
            <Button variant="outlined" color="primary" onClick={this.getWeather} className={classes.button}>Submit</Button>
            { this.state.forcastDisplay.length !== 0 && (
            <div>
                    {this.state.forcastDisplay}
            </div>
            )}
            </WeatherContainer>
            {this.state.forcastIndepth !== "" && (
               <ForcastDisplayContainer>
                <DetailsContainer>
                    <Button onClick={(e) => this.onClickCancel("Forcast", e)} variant = "outlined" className={classes.buttonCancel}>X</Button>
                    <Detail>
                        {this.state.forcastIndepth}
                    </Detail>
                </DetailsContainer>
                </ForcastDisplayContainer>
                )}
            {this.state.isLoading && (
                        <Loading>
                            <Spinner name="ball-spin-fade-loader" fadeIn="quarter" color="black"/>
                        </Loading>
                    )}
            {this.state.error && (
                        <ErrorContainer>
                            <ErrorPopup>
                                <Button onClick={(e) => this.onClickCancel("Error", e)} variant = "outlined" className={classes.buttonCancel}>X</Button>
                                <ErrorMessage>There was an error. Please try again later.</ErrorMessage>
                            </ErrorPopup>
                        </ErrorContainer>
                    )}
            {this.state.backgroundImg === "clear" && (
                <BackgroundClearIn>
                </BackgroundClearIn>
                )
            }
            {this.state.backgroundImg === "rain" && (
                <BackgroundRainIn>
                </BackgroundRainIn>
                )
            }
            {this.state.backgroundImg === "mist" && (
                <BackgroundMistIn>
                </BackgroundMistIn>
                )
            }
            {this.state.backgroundImg === "snow" && (
                <BackgroundSnowIn>
                </BackgroundSnowIn>
                )
            }
            {this.state.backgroundImg === "cloud" && (
                <BackgroundCloudIn>
                </BackgroundCloudIn>
                )
            }
            {this.state.backgroundPrevious === "clear" && (
                <BackgroundClearOut>
                </BackgroundClearOut>
                )
            }
            {this.state.backgroundPrevious === "rain" && (
                <BackgroundRainOut>
                </BackgroundRainOut>
                )
            }
            {this.state.backgroundPrevious === "mist" && (
                <BackgroundMistOut>
                </BackgroundMistOut>
                )
            }
            {this.state.backgroundPrevious === "snow" && (
                <BackgroundSnowOut>
                </BackgroundSnowOut>
                )
            }
            {this.state.backgroundPrevious === "cloud" && (
                <BackgroundCloudOut>
                </BackgroundCloudOut>
                )
            }
            </ComponentContainer>
         </MediaQuery>
          <MediaQuery query="(max-width: 1224px)">
                <ComponentContainer>
                    <WeatherContainerMobile>
                        <p>What weather would you like to see?</p>
                        <Autosuggest
                                renderInputComponent={this.renderInputComponent}
                                suggestions={this.state.suggestions}
                                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                                getSuggestionValue={this.getSuggestionValue}
                                renderSuggestion={this.renderSuggestion}
                                inputProps={inputProps}
                                theme={{
                                    container: classes.container,
                                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                                    suggestionsList: classes.suggestionsList,
                                    suggestion: classes.suggestion,
                                }}
                        />
                        <Button variant="outlined" color="primary" onClick={this.getWeather} className={classes.button}>Submit</Button>
                        { this.state.forcastDisplay.length !== 0 && (
                            <ForcastDisplayMobile>
                                    {this.state.forcastDisplay}
                            </ForcastDisplayMobile>
                        )}
                    </WeatherContainerMobile>
                    {this.state.forcastIndepth !== "" && (
                    <ForcastDisplayContainer>
                        <DetailsContainerMobile>
                            <Button onClick={(e) => this.onClickDetailsCancel(true, e)} variant = "outlined" className={classes.buttonCancel}>X</Button>
                            <Detail>
                                {this.state.forcastIndepth}
                            </Detail>
                        </DetailsContainerMobile>
                    </ForcastDisplayContainer>
                        )}
                    {this.state.isLoading && (
                        <Loading>
                            <Spinner name="ball-spin-fade-loader" fadeIn="quarter" color="black"/>
                        </Loading>
                    )}
                </ComponentContainer>
          </MediaQuery>
        <Footer/>
        </div>
    );
  }
}

////////////////////////////////////////////////
/////// custom input component to not lose ref//
////////////////////////////////////////////////
const InputComponent = (inputProps) => {
    return (<div><TextField fullWidth {...inputProps} /></div>);
}
////////////////////////////////////////////////
////////////// CSS for MaterialUI //////////////
////////////////////////////////////////////////
const styles = {
  container: {
    position: 'relative',
    color: 'black',
    width: '18em',
    marginBottom: '.5em',
    marginLeft: '2em'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: '1em',
    left: 0,
    right: 0,
    textAlign: 'left'
  },
  suggestion: {
    display: 'block',
    color: 'black',
    fontFamily: 'Raleway-Regular',
    marginBottom: '.5em',
    textAlign: 'left'
  },
  suggestionsList: {
    marginTop: '-1em',
    padding: '.5em',
    color: 'black',
    fontFamily: 'Raleway-Regular',
    listStyleType: 'none',
    textAlign: 'left',
    backgroundColor: 'white',
    border: '1px solid black',
    borderRadius: '5px',
  },
  button: {
    width: '18em'
  },
  buttonUnits :{
    width: '0',
    padding: '0',
    backgroundColor:"transparent",
    position: 'relative',
    margin: '-1em',
    "&:hover": {
        //you want this to be the same as the backgroundColor above
        backgroundColor: "transparent"
    }
  },
  buttonCancel: {
    width: '1em',
  },
}
////////////////////////////////////////////////
////////////// CSS for divs ////////////////////
////////////////////////////////////////////////
const TransitionIn = keyframes`
        0% { opacity: 0; }
        100% { opacity: 1; }
        }
    `;
const TransitionOut = keyframes`
        0% { opacity: 1;}
        100% { opacity: 0;}
    `;
const BackgroundRainIn = styled.div`
    position: absolute;
    z-index: 300;
    width:100%;
    height:78%;
    background: url(${rain}) center fixed no-repeat;
    background-size: cover;
    animation: ${TransitionIn} .75s 0s both;
`;
const BackgroundClearIn = styled.div`
    position: absolute;
    z-index: 300;
    width:100%;
    height:78%;
    background: url(${clear}) center fixed no-repeat;
    background-size: cover;
    animation: ${TransitionIn} .75s 0s both;
`;
const BackgroundSnowIn = styled.div`
    position: absolute;
    z-index: 300;
    width:100%;
    height:78%;
    background: url(${snow}) center fixed no-repeat;
    background-size: cover;
    animation: ${TransitionIn} .75s 0s both;
`;
const BackgroundCloudIn = styled.div`
    position: absolute;
    z-index: 300;
    width:100%;
    height:78%;
    background: url(${cloud}) center fixed no-repeat;
    background-size: cover;
    animation: ${TransitionIn} .75s 0s both;
`;
const BackgroundMistIn = styled.div`
    position: absolute;
    z-index: 300;
    width:100%;
    height:78%;
    background: url(${mist}) center fixed no-repeat;
    background-size: cover;
    animation: ${TransitionIn} .75s 0s both;
`;
const BackgroundRainOut = styled.div`
    position: absolute;
    z-index: 300;
    width:100%;
    height:78%;
    background: url(${rain}) center fixed no-repeat;
    background-size: cover;
    animation: ${TransitionOut} .75s 0s both;
`;
const BackgroundClearOut = styled.div`
    position: absolute;
    z-index: 300;
    width:100%;
    height:78%;
    background: url(${clear}) center fixed no-repeat;
    background-size: cover;
    animation: ${TransitionOut} .75s 0s both;
`;
const BackgroundSnowOut = styled.div`
    position: absolute;
    z-index: 300;
    width:100%;
    height:78%;
    background: url(${snow}) center fixed no-repeat;
    background-size: cover;
    animation: ${TransitionOut} .75s 0s both;
`;
const BackgroundCloudOut = styled.div`
    position: absolute;
    z-index: 300;
    width:100%;
    height:78%;
    background: url(${cloud}) center fixed no-repeat;
    background-size: cover;
    animation: ${TransitionOut} .75s 0s both;
`;
const BackgroundMistOut = styled.div`
    position: absolute;
    z-index: 300;
    width:100%;
    height:78%;
    background: url(${mist}) center fixed no-repeat;
    background-size: cover;
    animation: ${TransitionOut} .75s 0s both;
`;
const ForcastDisplayContainer = styled.div`
    z-index:450;
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    background: rgba(0, 0, 0, 0.5);;
    overflow-y:scroll;
`;
const ForcastFiveDay = styled.div`
    display: flex;
    justify-content: space-between;
`;
const ForcastDetailsContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-family: Moon-Light;
    font-size:15pt;
`;
const ForcastDetailsItem = styled.div`

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;
const DetailsContainer = styled.div`
    position: absolute;
    z-index: 450;
    top: 3em;
    margin: 0 auto;
    max-width: 50%;
    background: rgb(245,245,245);
    text-align:right;
 `;
 const ErrorContainer = styled.div`
    z-index:450;
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center
    background: rgba(0, 0, 0, 0.5);;
`;
 const ErrorPopup = styled.div`
    position: absolute;
    z-index: 450;
    max-width: 50%;
    background: rgb(245,245,245);
    border-radius: 5px;
    text-align:right;
    font-family: Raleway-Regular;
 `;
  const ErrorMessage = styled.div`
    padding: 2em;
 `;
const Detail = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  `;
const ComponentContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  `;
const SuggestionContainer = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: center;
`;
  const WeatherContainer = styled.div`
    margin: 2em;
    position:relative
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    font-family: Raleway-Bold;
    z-index:400;
    border-radius: 5pt;
    background-color: rgba(255, 255, 255, 0.8);
  `;
  const Loading = styled.div`
    width: 100%;
    height:100%;
    position:fixed;
    top:0;
    left: 0;
    z-index:500;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
  `;
////////////////////////////////////////////////
////////////// Mobile CSS// ////////////////////
////////////////////////////////////////////////
    const WeatherContainerMobile = styled.div`
    margin: 2em;
    position:relative
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    font-family: Raleway-Bold;
    z-index:400;
    border-radius: 5pt;
    background-color: rgba(255, 255, 255, 0.8);
  `;
  const ForcastDisplayMobile = styled.div`
    display:flex;
    flex-wrap:wrap;
    mix-width:90%;
  `;
  const ForcastFiveDayMobile = styled.div`
    display:flex;
    justify-content: center;
    flex-wrap:wrap;
    max-width:100%;
    `;
const DetailsContainerMobile = styled.div`
    position: absolute;
    z-index: 450;
    top: 3em;
    margin: 0 auto;
    max-width: 90%;
    background-color: white;
    text-align:right;
 `;
export default withStyles(styles)(Home);


