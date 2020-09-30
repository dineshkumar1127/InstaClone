import React , { useState , useEffect , useContext } from 'react'
import {UserContext} from '../app'
import { Link } from 'react-router-dom'


const Home =()=>{
 
    const [data , setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    

    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization":"jozem "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
            
            setData(result.posts)
            
        })
    },[])


    const likePost = (id)=>{
        fetch('/like',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"jozem "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
        }).then(res=>res.json()).then(result=>{

            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
            
        }).catch(err=>{
            console.log(err)
        })
    }


    const unlikePost = (id)=>{
        fetch('/unlike',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"jozem "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
        }).then(res=>res.json()).then(result=>{

            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                    
                }
                else{
                    return item
                
                }
            })
            setData(newData)

        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"jozem "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res=>res.json()).then(result=>{
            console.log(result)

            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }


        const deletePost = (postid)=>{
            fetch('/removepost/'+postid,{
                method:"delete",
                headers:{
                   // "Content-Type":"application/json",               dont need to add as we are not adding anything
                    Authorization:"jozem "+ localStorage.getItem("jwt")
                }
              /*  body: JSON.stringify({
                    postId:id*/
                }).then(res=>res.json()).then(result=>{

                    console.log(result)

                    const newData = data.filter(item=>{
                        return item._id !== result._id
                    })
                    setData(newData)
                })

            }
        


    return (
        <div className="home">
            {
                data.map(item=>{

                    return (
                            <div className="card home-card">

                    <h5 style={{padding:"6px"}}><Link  to={ item.postedBy._id !== state._id  ?  "/profile/"+item.postedBy._id : "/profile"}> {item.postedBy.name} </Link> {item.postedBy._id == state._id

                    && <i key="0" className="material-icons" style={{float:"right"}} onClick={()=>{deletePost(item._id)}}
                    >delete</i>}</h5>

                    <div className="card-image">
                            <img key={item._id} src={item.photo} />
                    </div>

                    <div className="card-content">
                     

                      {item.likes.includes(state._id) ?
                        <i key="1"className="material-icons" style={{color:'red'}} onClick={()=>{unlikePost(item._id)}}>favorite</i>
                        :
                        <i key="2" className="material-icons" onClick={()=>{likePost(item._id)}}>favorite_border</i>
                      }
                 
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>

                            {
                                item.comments.map(comm=>{
                                    return (
                                    <h6 key={comm._id}> <span style={{fontWeight:"500"}}>{comm.postedBy.name} : </span> {comm.text}</h6>
                                    )
                                })
                            }

                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                makeComment(e.target[0].value , item._id )
                            }}>
                            <input type="text" placeholder=" add a comment"/>
                            </form>
                        
                    </div>
                    
                </div>
                    )
                })
            }
 </div>
    );
}

export default Home;