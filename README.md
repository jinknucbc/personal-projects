# Personal Projects Repository
Welcome to my repository. I will be creating my website to host all of these projects once I'm done with my third project which focuses on language studying. 

# Currently in this repository:
## [Weather Application](https://jinknucbc.github.io/personal-projects/WeatherApp/)
## Fullstack [To Do List](https://jinknucbc.github.io/personal-projects/ToDoList/)

## [Weather Application](https://jinknucbc.github.io/personal-projects/WeatherApp/)
**Project Description**: This is a simple weather forecast application that focuses on Frontend development and there are no login features or database implemented. The project was kept simple by design as the main purpose of it was to refresh my React knowledge and Javascript API call. It asks the user's permission to track location. (Because the application, which was developed while I was still in the US as a student, uses Geocodio, for users outside of the United States and Canada, the default weather display of their location may not work.) The user can, of course, search for their desired location in the search bar. While WeatherAPI subscription initially allowed for 8 ~ 10 days' worth of forecast with free trial, free account now only allows for 3 days. The user can click on Fahrenheit/Celsius button to suit their needs.

**Area of Improvement**: As may be made obvious while using the application, the application will display "0% chance of snow" even when it is supposed to say "rain". As this isn't a make-or-break error, I had decided to move on to my next project--the main purpose of the project was to refresh myself on API calls and working with React state maanagement. If I were to develop a more fully functional version of this application, or if I decided to come back to this, I would add a month-check and/or better parse the object returned by WeatherAPI.

**Tech Stack**: Javascript, React, CSS, HTML

## [To Do List](https://jinknucbc.github.io/personal-projects/ToDoList/)
**Project Description**: My goal with this project wasn't to build a simple to-do list that one can find on YouTube. Is it essentially just a to-do list? Yes, but I wanted to go deeper than merely developing Frontend CRUD as most tutorials do. I wanted to add Login/SignUp features as well as data management through Firebase so that even when the user completely shuts the application, the next time they come back and login, their list(s) would still be there. While this project definitely took much longer than I anticipated/wanted--discovering that I needed to go even deeper as well as taking breaks from this to face other things in life--it was overall a great learning journey. This project allowed me to learn React hooks such as useContext, useRef, and custom hooks which I wish that my academic program had covered. The user should be able to sign up, verify email, login, create a list, create items in the list, and edit/delete items/lists. On top of that, the user should be able to change/reset password and delete their account.

**Area of Improvement**: As this project had already taken much longer than I anticipated/wanted, I have decided to move on despite its imperfection--"Remove All" when it comes to list still seems to have UI state desynchronization--as I honestly have been wanting to move on to developing an application that can be published to address a problem when it comes to studying language.

**Tech Stack**: Javascript, React, Firebase, CSS, HTML
