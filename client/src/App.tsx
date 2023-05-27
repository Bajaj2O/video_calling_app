import './App.css'
import './index.css'
import {
BrowserRouter,
Route,
Routes

} from 'react-router-dom'
import { SocketProvider } from './providers/socket'
import {Home , Room} from './components'
// import { PeerProvider } from "./providers/peer";


function App() {
  return (
    <>
      <BrowserRouter>
        
        <SocketProvider>
        <Routes>
          <Route path='/'  element={<Home/>}/>
          <Route path='/room/:id'   element={<Room/>}/>
        </Routes>
        </SocketProvider>
        
      </BrowserRouter>
      
    </>
  )
}

export default App
