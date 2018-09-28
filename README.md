## The Weather App
  An application that can tell the 5 day weather forcast for a given city and/or region
## How to Buildit ;)
  The Weather App was built using React.js bootstrapped using create-react-app, using npm to manage my project and its node modules
  Step 1: NPM environment is up and running
  Step 2: Pull project from Github
  Step 3: 'npm install'
  Step 4: npm start 
    Note: I had to change the npm scripts command to 'react-scripts --max_old_space_size=4096 start' because by dev server was crashing on start up. This may have been possibly due to the giant cityID JSON file from OpenWeatherMap (still trying to figure it out the root of the issue).
  Everything should work :D

## Thought Process
  I wanted to make something that I could see myself using. Conceptually, I wanted to make something that was simple, but useful. I also wanted to use Material-UI because I had never worked with it on a project before. I also thought it would be cool if a background image cooresponding to the weather would be displayed when the user would hover would hover over a day (but I knew this would be one of the least important things technically). Because that way a person could know loosely what the weather is without looking at info.

## Challenges
  1. Querying the giant JSON file given to me by OpenWeatherMaps. The file is used to send the OWM API the city code to retrieve the most accurate weather information according to the documentation. Initial lookup time was very slow.
  2. Parsing the information and separating into subsequent days. 
  3. The biggest challenge I had was converting the UTC times to the time of the country. OWM gave me the times of the city in UTC but didn't tell me the timezone that the city was in so I could get the time offset. I ended up calling another API TimezoneDB, sending it the lat and long coordinates of the city queried so I could get timezone and hence, the offset.
  
## Tradeoffs
  
  
## With more time I would...
  1) Try to display the information in a more aesthetically pleasing. All the other weather apps I saw graph the increase of decrease in temperature. It would be cool to make graphs over time for the information at the very least.
  2) Add a Celcius and/or Kelvin feature.
  3) Figure out a more accurate way to calculate what logo I need to show on the 5 day panels.
  
  
