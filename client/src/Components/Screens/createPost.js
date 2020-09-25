import React, {useState , useEffect} from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'


const CreatePost=()=>{
     const history = useHistory()
     const [title,setTitle] = useState("")
     const [body,setBody] = useState("")
     const [image ,setImage] = useState("")
     const [url ,setURl] = useState("")
     useEffect(()=>{
         if(url){

            fetch('/createpost',{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"jozem "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                   title,
                   body,
                   pic:url
                })
            }).then(res=>res.json()).then(data=>{
                   if(data.error){
                   M.toast({html: data.error , classes:'rounded #3f51b5 indigo'})
                   }
                   else{
                       M.toast({html: "Post created Successfully" ,classes: 'rounded #4caf50 green'})
                       history.push('/')
                   }
            })
            .catch(err=>{
                console.log(err)
            })
         }

     },[url])  //dependency array


     const postDetail = () =>{
         const dataa  = new FormData()
         dataa.append("file",image)
         dataa.append("upload_preset","insta-clone")
         dataa.append("cloud_name","dcirgll8n")

         fetch("https://api.cloudinary.com/v1_1/dcirgll8n/image/upload",{
             method:"post",
             body:dataa
         })
         .then(res=>res.json()).then(data=>{
             setURl(data.url)
         })
         .catch(err=>{
             console.log(err)
         })      

     }







    return (
        <div className="card input-field " style={{margin:"10px auto",maxWidth:"500px",padding:"50px",textAlign:"center"}}>
            <input type="text" 
            placeholder="title"
             value = {title}
              onChange = {(e)=>setTitle(e.target.value)}
               />
            <input type="text"
             placeholder="body"
             value = {body}
             onChange = {(e)=>setBody(e.target.value)}
             />

                <div className="file-field input-field">
                <div className="btn waves-effect waves-light #ef5350 red darken-1">
                <span>Upload</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper input-field">
                <input className="file-path validate" type="text"/>
                </div>
                </div>

                <button className="btn waves-effect waves-light #ef5350 red darken-1" type="submit" name="action"
                onClick={()=>postDetail()}
                >Submit Post
                </button>
        </div>
    );
}

export default CreatePost