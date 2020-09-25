import React,{useContext,useState,useEffect} from 'react'
import {UserContext} from '../app'
import {useParams } from 'react-router-dom'         //HOOKS


const UserProfile=()=>{
    
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userId} = useParams()
    const [showfollow ,setShowFollow] = useState(state ? !state.following.includes(userId) : true)

    useEffect(()=>{
        fetch(`/user/${userId}`,{
            headers:{
                "Authorization":"jozem "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
           setProfile(result)
        })
    },[])


    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"jozem "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userId
            })

        }).then(res=>res.json()).then(data=>{
            
            dispatch({ type:"UPDATE" , payload: {following: data.following , follower: data.follower}})
            localStorage.setItem("user",JSON.stringify(data))

            setProfile((prevState)=>{

                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        follower: [...prevState.user.follower , data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }


    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"jozem "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userId
            })
        }).then(res=>res.json()).then(data=>{

            dispatch({type:" UPDATE" , payload:{following: data.following, follower: data.follower}})
            localStorage.setItem("user",JSON.stringify(data))

            setProfile((prevState)=>{
                const newFollower = prevState.user.follower.filter(item=>item != data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        follower:newFollower
                    }
                }
            })
            setShowFollow(true)
        })
    }


    return (
        <>
      {userProfile 
        ?  
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:" 18px 0px",
                borderBottom:"1px solid grey"
            }}>

            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                src={userProfile.user.pic}
                />
            </div>

            <div>
            <h4>{userProfile.user.name}</h4>
            <h6 style={{fontWeight:"500"}}>{userProfile.user.email}</h6 >
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                  <h6>{userProfile.posts.length} post</h6>
                  <h6>{userProfile.user.follower.length} follower</h6>
                  <h6>{userProfile.user.following.length} following</h6>
                </div>


                {showfollow ? 
                <button style={{margin:"10px"}} className="btn waves-effect waves-light #ef5350 red darken-1" 
                type="submit" name="action" onClick={()=>followUser()}>follow</button>
                :
                <button style={{margin:"10px"}} className="btn waves-effect waves-light #ef5350 red darken-1" 
                type="submit" name="action" onClick={()=>unfollowUser()}>unfollow</button>
               
            }
                

     
            </div>



            </div>

             <div className="gallery">
                 {
                     userProfile.posts.map(item=>{
                         return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                         )
                     })
                 }
             </div>        
        </div>
        :
         <h2 style={{ font:"caption"}}>loading.....!</h2>}
       
        </>
    );
}

export default UserProfile;






// var exists = msgArr.objectId.includes(data.objectId);
// var exists = msgArr.some(o => o.objectId === data.objectId);