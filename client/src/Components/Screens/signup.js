import React from 'react'
import { useState, useEffect} from 'react'
import { Link , useHistory} from 'react-router-dom'
import M from 'materialize-css'



const SignUp=()=>{
    const history = useHistory()
    const [name , setName] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [image,setImage] = useState("")
    const [url,setURl] = useState(undefined)

    useEffect(()=>{   // if pic is available in Url we will run again the uploadField so that with data we can signup
        if(url){
            uploadField()
        }
    },[url])

    const uploadPic=()=>{
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

    const uploadField =()=>{ 
        
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: "Invalid Email",classes:'rounded #3f51b5 indigo'})
        return;
    }

        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                email:email,
                password:password,
                pic:url 
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                M.toast({html: data.error , classes: 'rounded #3f51b5 indigo'})
            }
            else{
                M.toast({html: data.message , classes: 'rounded #4caf50 green'})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })

    }

    const postdata = ()=>{
        if(image){
            uploadPic()
        }
        else{
            uploadField()
        }
  
    }


    
    return(
        <div>
            <div className="myCard">
                <div className="card auth-card input-field">
                    <h2 className="name">Instagram</h2>
                    <input
                    type="text"
                    placeholder="User Name"
                    value = {name}
                    onChange = {(e)=>setName(e.target.value)}
                    /> 

                    <input
                    type="text"
                    placeholder="Email"
                     value = {email}
                    onChange = {(e)=>setEmail(e.target.value)}
                    />

                    <input
                    type="password"
                    placeholder="Password"
                    value = {password}
                    onChange = {(e)=>setPassword(e.target.value)}
                    />

                <div className="file-field input-field">
                <div className="btn waves-effect waves-light #ef5350 red darken-1">
                <span>Upload pic</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper input-field">
                <input className="file-path validate" type="text"/>
                </div>
                </div>



                    <p/>
                    <button className="btn waves-effect waves-light #ef5350 red darken-1" type="submit" name="action"
                    onClick = {()=>postdata()} 
                    >
                    Register
                    </button>

                    <Link to="/signIn"> 
                    <h5>Already have an Account ?</h5>
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default SignUp;