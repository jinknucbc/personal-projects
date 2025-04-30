import"./App.css"
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainScreen from './components/MainScreen'
import TheList from './components/TheList'
import {ContextProvider} from "./components/ListContext"

function App() {

  return (
    <BrowserRouter>
      <ContextProvider>
        <Routes>
            {/* <Header /> */}
            {/* <CreateList /> this will likely be just a button */}
            {
            /* For now, I'm going to have "ListDisplay" here, but this will likely be put into a separate component called something like
              ListBody or something...

              Also, either in this component or in another, the application will need a textbox it'll need to pass its data to this component
              anyway. "All roads lead to Rome" type of idea where this component is where all the existing components meet, whether directly or
              indirectly through inheritance/prop passing. Meaning, data that will be global to all the components will be handled/managed here,
              meaning their useState or other hooks will be defined here.

              Actually, I think I'll show user input textbox only inside the list component, because I don't like the idea of having a huge textbox
              just sitting in the general body of the application. It should appear only when the user is creating a list and has to type something in.
              Now, I do want to have the title of each list displayed when we show the list of lists, so the list title and the first few words of the
              list will have to be managed in this component. Key prop will be crucial in getting this done to make sure that what is briefly shown, when
              actually clicked upon, is what really appears.

            */
            }
            <Route path="/" element={<MainScreen />} />
            <Route path="/list/:id" element={<TheList />} />
            <Route path="/list/:id/new" element={<TheList isNew={true} />} />
            {/* This should render "MainScreen" component. <MainScreen /> */}

        </Routes>
      </ContextProvider>
    </BrowserRouter>
  )
}

// For now, I won't be working on the backend part as I just want to get the frontend functional.
// The final form of this project, however, will have a header bar with Login and Dark Mode and Color Blind friendly mode.

export default App
