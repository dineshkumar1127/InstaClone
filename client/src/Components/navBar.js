import './component.css'
import React ,{useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'

import { UserContext } from './app'



const NavBar =()=>{

  const history = useHistory() 

  const {state,dispatch} = useContext(UserContext)

   const renderList=()=>{
     if(state){
       return [
        <li key="six"><Link to="/SubscribedUserPost">Following Post</Link></li>,
        <li key="one"><Link to="/createPost">Create Post</Link></li>,
        <li key="two"><Link to="/profile">Profile</Link></li>,
        
        <li key="five">
          <button className="btn waves-effect waves-light #ef5350 red darken-1" type="submit" name="action"
          onClick = {()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push('/signin')
          }}>
                  Log Out
                </button>
        </li>
       ]
     }
     else{
       return [
        <li key="three"><Link to="/signin">SignIn</Link></li>,
        <li key="four"><Link to="/signup">SignUp</Link></li>
       ]
     }
   }

    return(
        <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/signin"}className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
    );
}

export default NavBar;