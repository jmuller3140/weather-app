## The Weather App
  An application that can tell the 5 day weather forcast for a given city and/or region
## How to Buildit ;)
  The Weather App was built using React.js bootstrapped using create-react-app, using npm to manage my project and its node modules:<br/>
  Prereqs: Have Node installed, clone repo<br/>
  Step 1: `npm install`<br/>
  Step 2: Create .env file<br/>
    I provided a .env.example as a starting point. It has the URLs for the free apis . The only thing needed to run is a the free appIds. You can get it from:<br/>https://openweathermap.org/api<br/>
and<br/>https://timezonedb.com/register<br/>
  Step 3: `npm start` <br/>
  
The reason why I ended up using another api was to get the timezone for each city's weather information I was getting back. OWM does not provided the timezone or offset of the time in reference to UTC (at least not from what I saw)<br/>
   
  Everything should work :D

## Thought Process
  I wanted to make something that I could see myself using. Conceptually, I wanted to make something that was simple, but useful. <br/>I also wanted to use Material-UI because I had never worked with it on a project before. I also thought it would be cool if a background image cooresponding to the weather would be displayed when the user would hover would hover over a day (but I knew this would be one of the least important things technically), that way a person could know loosely what the weather is without looking at info.

## Challenges
  1. Querying the giant JSON file given to me by OpenWeatherMaps. The file is used to send the OWM API the city code to retrieve the most accurate weather information according to the documentation. Initial lookup time was very slow.
  2. Parsing the information and separating into subsequent days. 
  3. The biggest challenge I had was converting the UTC times to the time of the country. OWM gave me the times of the city in UTC but didn't tell me the timezone that the city was in so I could get the time offset. I ended up calling another API TimezoneDB, sending it the lat and long coordinates of the city queried so I could get timezone and hence, the offset.
  
## Tradeoffs
  1. I didn't write tests because of limited time, however going forward to expand on the project, I would be looking to build tests.
  2. Because The Weather App is a SPA, the user will have to download a larger bundle. This could be solved by code splitting. 
  3. SEO could also be a potential issue with a full SPA, this could be solved by server side rendering.  If a web crawler does not/cannot does not use javascript, it won't see the site. 
  4. Similar to 2, if the user has javascript disabled, they wont be able to see the site.
  
## With more time I would...
  1. Try to display the information in a more aesthetically pleasing. All the other weather apps I saw graph the increase of decrease in temperature. It would be cool to make graphs over time for the information at the very least.
  2. Figure out a more accurate way to calculate what logo I need to show on the 5 day panels.
  3. Try to manipulate and organize the json cityID lookup to be more user friendly. Some cities have multiple id's and can be confusing, as it just shows multiple cities. 
 
 ## Notes
  1.   I had to change the npm scripts command to `react-scripts --max_old_space_size=4096 start` because by dev server was crashing on start up. This may have been possibly due to the giant cityID JSON file from OpenWeatherMap (still trying to figure it out the root of the issue).<br/>
  2. Apparently there have been errors in Safari in some of the keyframe animations. I do not have a Mac so it is hard for me to error test at the moment. 
  
