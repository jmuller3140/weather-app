// import React from 'react';

// import styled from 'styled-components';
// import PropTypes from 'prop-types';
// import Autosuggest from 'react-autosuggest';
// import TextField from '@material-ui/core/TextField';
// import Paper from '@material-ui/core/Paper';
// import MenuItem from '@material-ui/core/MenuItem';
// import Button from '@material-ui/core/Button';
// import request from 'superagent';
// import moment from 'moment-timezone';
// import Spinner from 'react-spinkit';
// import { withStyles } from '@material-ui/core/styles';

// import Day from '../components/Day';
// import Details from '../components/Details';
// import jsonData from './citylist.json';

// const Home = () => {
//     return(<div>hi</div>)
// }
// export default Home

import React from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import request from 'superagent';
import moment from 'moment-timezone';
import Spinner from 'react-spinkit';
import { withStyles } from '@material-ui/core/styles';

import Day from '../components/Day';
import Details from '../components/Details';
import jsonData from './citylist.json';

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
        this.onClickDetailsCancel = this.onClickDetailsCancel.bind(this);
        this.getTempArray = this.getTempArray.bind(this);
        this.setTimeZone = this.setTimeZone.bind(this);
        this.state = { value: '', suggestions: [], suggestionsList: [], forcastDisplay: [], forcastIndepth: "", timezone: "", isLoading: false}
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
        return (
            <TextField fullWidth {...inputProps} />
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
    onClickDetailsCancel(action, e){
        if(action){
            this.setState({forcastIndepth: ""});
        }
    else{
            e.stopPropagation();
        }
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
        return inputLength === 0 ? [] : this.state.suggestionsList.filter(suggestion => {
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
        //units = metric for
        //no parms for K
        //units imperial for F
        let address = "http://api.openweathermap.org/data/2.5/forecast";
        let that=this;
        request
        .get(address)
        .query({'id': this.cityId})
        .query({'APPID': 'd10ac900e1d470d9e0b26931e17d30f0'})
        .query({'units': 'imperial'})
        .set('Accept', 'application/json')
        .then( res => {
            let json = JSON.parse(res.text);
            json["getDetails"] = this.getDetails;
            this.runner(json.city.coord, json).then(function(data){
                that.setState({forcastDisplay: data});
                that.setState({isloading: false});
            })
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
            let address = "http://api.timezonedb.com/v2.1/get-time-zone";
            const {lat, lon} = coord;
            let that=this;
            console.log(json);
            request
            .get(address)
            .query({'key': 'NKTLFL9PDN1F'})
            .query({'by': 'position'})
            .query({'lat': lat})
            .query({'lng': lon})
            .query({'format': 'json'})
            .set('Accept', 'application/json')
            .then( res => {
                let timeZoneDetails = JSON.parse(res.text);
                let timezone = timeZoneDetails.zoneName;
                resolve({timezone: timezone, details: json})
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
            console.log(json);
            for(var i = 0; i < json.details.cnt; i++){
                const date = moment.unix(json.details.list[i].dt).utc();
                let convertedDate = date.tz(json.timezone).format('YYYY-MM-DD HH:mm');
                json.details.list[i].dt_txt_local = convertedDate.toString();
                let forcastDay = date.toString().slice(0, 15);
                const convertedHour = date.tz(json.timezone).hour();

                if(convertedHour === 11 || convertedHour === 12 || convertedHour === 13){
                    weatherIcon = json.details.list[i].weather.icon;
                    weatherDescription = json.details.list[i].weather.description;
                }
                if(i === 0 ){
                    if(convertedHour > 13){
                        weatherIcon = json.details.list[i].weather.icon;
                        console.log(weatherIcon);
                        weatherDescription = json.details.list[i].weather.description;
                        console.log(weatherDescription);
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
            resolve({tempArray: tempArray, getDetails: json.details.getDetails});
        })
    }
////////////////////////////////////////////////
/////// creates days from getTempArray /////////
////////////////////////////////////////////////
    getForcast(forcastInfo) {
        console.log(forcastInfo);
        return new Promise((resolve, reject) => {
            let key = 0;
            let forcast = forcastInfo.tempArray.map( day => {
                let props = {key: key, getDetails: forcastInfo.getDetails, hour: day.hour, maxTemp: day.maxTemp, minTemp: day.minTemp, forcastDay: day.forcastDay, weatherIcon: day.weatherIcon, weatherDescription: day.weatherDescription};
                key++;
                return (<Day {...props} />)
                });
            resolve(<ForcastFiveDay>{forcast}</ForcastFiveDay>)
        })
    }
////////////////////////////////////////////////
//// setting the json city code data  //////////
////////////////////////////////////////////////
    componentDidMount = () => {
        this.setState({suggestionsList: jsonData});
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

    const {suggestions} = this.state;
    return (
        <ComponentContainer>
           <WeatherContainer>
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
            <div>
                {this.state.forcastDisplay}
            </div>
            )}
            </WeatherContainer>
            {this.state.forcastIndepth !== "" && (
            <DetailsContainer>
                <Button onClick={(e) => this.onClickDetailsCancel(true, e)} variant = "outlined" className={classes.button}>Cancel</Button>
                <Detail>
                    {this.state.forcastIndepth}
                </Detail>
            </DetailsContainer>
                )}
            {this.state.isLoading && (
                        <Loading>
                            <Spinner name="ball-spin-fade-loader" color="black"/>
                        </Loading>
                    )}
        </ComponentContainer>
    );
  }
}
////////////////////////////////////////////////
////////////// CSS for MaterialUI //////////////
////////////////////////////////////////////////
const styles = {
  container: {
    position: 'relative',
    color: 'black',
    width: '16em',
    marginBottom: '.5em'
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
    margin: 0,
    padding: 0,
    color: 'black',
    fontFamily: 'Raleway-Regular',
    listStyleType: 'none',
    textAlign: 'left'
  },
  button: {
    width: '18em'
  },
}
////////////////////////////////////////////////
////////////// CSS for divs ////////////////////
////////////////////////////////////////////////
const ForcastFiveDay = styled.div`
    display: flex;
    justify-content: space-between;
`;
const ForcastDetailsContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const ForcastDetailsItem = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;
const DetailsContainer = styled.div`
    position: absolute;
    z-index: 100;
    top: -3em;
    margin: 0 auto;
    maxWidth: 50%;
    background-color: 'silver'
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
  const WeatherContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    font-family: Raleway-Bold;
  `;

  const Loading = styled.div`
    width: 100%;
    position:relative;
    height:300px;
    float:left;
    z-index:500;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
  `;
export default withStyles(styles)(Home);


