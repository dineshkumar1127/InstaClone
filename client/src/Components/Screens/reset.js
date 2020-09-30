import React, {useState,useContext}from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'


const Reset=()=>{

    const history = useHistory()
    const [email , setEmail] = useState("")

    const postdata = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: "Invalid Email",classes:'rounded #3f51b5 indigo'})
        return
    }
        fetch("/reset-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
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
                    type="text"
                    placeholder="Email"
                    value = {email}
                    onChange = {(e)=>setEmail(e.target.value)}
                    />

                    <p/>
                    <button className="btn waves-effect waves-light #ef5350 red darken-1" type="submit" name="action"
                    onClick = {()=>postdata()}
                    >
                    Reset
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Reset;