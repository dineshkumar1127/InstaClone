import React, {useState,useContext}from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css'

import { UserContext } from '../app'


const NewPassword=()=>{
    const {token} = useParams()
    const history = useHistory()
    const [password , setPassword] = useState("")

    const postdata = ()=>{
   
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password:password,
                token
            }) 
            }).then(res=>res.json()).then(data=>{
            if(data.error){
                M.toast({html: data.error , classes: 'rounded #3f51b5 indigo'})
            }
            else{
                M.toast({html:data.message, classes: 'rounded #4caf50 green'})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }



    return (
        <div>
            <div className="myCard">
                <div className="card auth-card input-field">
                    <h2 className="name">Instagram</h2>
                    <input
                    type="password"
                    placeholder="New Password"
                    value = {password}
                    onChange = {(e)=>setPassword(e.target.value)}
                    />

                    <button className="btn waves-effect waves-light #ef5350 red darken-1" type="submit" name="action"
                    onClick = {()=>postdata()}
                    >
                    Update Password
                    </button>

                </div>
            </div>
        </div>
    );
}

export default NewPassword ;