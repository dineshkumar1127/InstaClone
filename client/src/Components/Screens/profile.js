import React,{useContext,useState,useEffect} from 'react'
import {UserContext} from '../app'
import {useHistory} from 'react-router-dom'



const Profile=()=>{
    const history = useHistory()
    const [pic,setPic] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")


    


    useEffect(()=>{
        if(image){
            const dataa  = new FormData()
            dataa.append("file",image)
            dataa.append("upload_preset","insta-clone")
            dataa.append("cloud_name","dcirgll8n")
        
            fetch("https://api.cloudinary.com/v1_1/dcirgll8n/image/upload",{
                method:"post",
                body:dataa
            })
            .then(res=>res.json()).then(data=>{
               
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"jozem "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json()).then(result=>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,pic:data.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
            })
            .catch(err=>{
                console.log(err)
            }) 
        }
        },[image])
        
        
        const updatePhoto=(file)=>{
            setImage(file) 
        }

        

    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization":"jozem "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
         console.log(result)
        
            setPic(result.mypost)
        })
     },[])



    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{ margin:" 18px 0px",
                borderBottom:"1px solid grey"}}>

            <div style={{
                display:"flex",
                justifyContent:"space-around",
               
            }}>

            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                src={state ? state.pic : "loading"}
                />
            </div>

            <div>
            <h4>{state ?state.name:"loading"}</h4>
            <h6 style={{fontWeight:"500"}}>{state ?state.email:"loading"}</h6 >
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                  <h6>{pic.length} posts</h6>
                  <h6>{state?state.follower.length:"0"} follower</h6>
                  <h6>{state?state.following.length:"0"}  following</h6>

                </div>
            </div>
        </div>
        <div className="file-field input-field" style={{margin:"10px"}}>
                <div className="btn waves-effect waves-light #ef5350 red darken-1" >
                <span>Upload pic</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper input-field">
                <input className="file-path validate" type="text"/>
                </div>
                </div>
     </div>



             <div className="gallery">
                 {
                     pic.map(item=>{
                         return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                         )
                     })
                 }
             </div>        
        </div>
    );
}

export default Profile;