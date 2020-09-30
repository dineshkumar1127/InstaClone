import React, {useEffect, createContext,useReducer,useContext} from 'react'
import NavBar from './navBar'
import {BrowserRouter,Route,useHistory,Switch} from 'react-router-dom'
import Home from './Screens/home'
import Profile from './Screens/profile'
import SignIn from './Screens/signin'
import SignUp from './Screens/signup'
import CreatePost from './Screens/createPost'
import Search from './Screens/userProfile'
import Reset from './Screens/reset'
import NewPassword from './Screens/newPassword'
import {reducerrrr,initState} from '../reducer/userReducer'
import SubscribedUserPost from './Screens/SubscribedUserPost'

export const UserContext = createContext()

const Routing=()=>{
    const {state,dispatch} = useContext(UserContext)

    const history = useHistory()
    useEffect(()=>{
        const user  = JSON.parse(localStorage.getItem("user"))      //we are using parse because user data is in string form and we need object
        if(user){
            dispatch({type:"USER",payload:user})
           // history.push('/')
        }
        else{
            if(!history.location.pathname.startsWith('/reset'))
            history.push('/signin')
        }
    },[])
return (   //switch chooses any one of the route path and work on it 
    <Switch>                            

            <Route exact  path="/"> <Home /> </Route>
            <Route exact path="/profile"> <Profile /> </Route>
            <Route path="/signin"> <SignIn /> </Route>
            <Route path="/signup"> <SignUp /> </Route>
            <Route path="/createPost"> <CreatePost /> </Route>
            <Route path="/profile/:userId"> < Search /> </Route>
            <Route path="/SubscribedUserPost"> <SubscribedUserPost /> </Route>
            <Route exact path="/reset"> <Reset /> </Route>
            <Route path="/reset/:token"> <NewPassword /> </Route>

    </Switch>
)
}



const App =()=>{
    const [state,dispatch] = useReducer(reducerrrr,initState)
    return(
        <UserContext.Provider value={{state,dispatch}} >
        <BrowserRouter>

        <NavBar />
        <Routing />

        </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;