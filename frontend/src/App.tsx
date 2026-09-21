import './App.css'
import { AuthProvider } from './Context/AuthContextProvider'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthPage } from './Pages/AuthPAge'
import { HomePage } from './Pages/Home'
import { NotesPage } from './Pages/NotesPage'



function App() {
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
