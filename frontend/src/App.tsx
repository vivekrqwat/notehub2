import { useState } from 'react'

import './App.css'
import { AuthProvider } from './Context/AuthContextProvider'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthPage } from './Pages/AuthPAge'
import { HomePage } from './Pages/Home'
import { DirectoriesPage } from './Pages/DirecteriesPage'
import { NotesPage } from './Pages/NotesPage'



function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
     <BrowserRouter>
    <Routes>
    <Route path='/login' element={<AuthPage mode={"login"}></AuthPage>}>


    </Route>
     <Route path='/signup' element={<AuthPage mode={"sign up"}></AuthPage>}>


    </Route>
    <Route path="/home" element={<HomePage></HomePage>}></Route>
    <Route path="/notes/:directoryId" element={<NotesPage />}></Route>
      

    </Routes>


     </BrowserRouter>




    </AuthProvider>
    
  

    

     

   
    
  )
}

export default App
