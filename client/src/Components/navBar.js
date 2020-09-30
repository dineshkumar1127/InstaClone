import './component.css'
import React ,{useContext, useRef, useEffect, useState} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from './app'



const NavBar =()=>{
   
  const searchModal = useRef(null)
  const [search,setSearch] = useState('')
  const [userDetails , setUserDetails] = useState([])
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory() 

  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])

   const renderList=()=>{
     if(state){
       return [
         <li key="nine"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
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


   const fetchUsers = (query)=>{
     setSearch(query)
     fetch('/search-user',{
       method:"post",
       headers:{
         "Content-Type":"application/json",
       },
       body:JSON.stringify({
         query
       })
     }).then(res=>res.json()).then(result=>{
       console.log(result)
       setUserDetails(result.user)
     })
   }

    return(
        <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/signin"}className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>

        <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content" >
          <input
                    type="text"
                    placeholder="Search Users"
                    value = {search}
                    onChange = {(e)=>fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                      {
                        userDetails.map(item=>{
                        return <Link to ={state._id !== item._id ? "/profile/"+item._id : "/profile"}  onClick={()=>{
                          M.Modal.getInstance(searchModal.current).close()
                          setSearch('')
                        }}> <li className="collection-item">{item.email}</li> </Link>
                        })
                      }
                      </ul>
  
                
          </div>
          <div className="modal-footer">
            <button  className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
          </div>
        </div>
      </nav>
    );
}

export default NavBar;