import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../userContext";

export default function LoginPage() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [redirect,setRedirect] = useState(false);
    const {setUser} = useContext(userContext);

    async function login(ev){
        ev.preventDefault();
        const resp = await fetch("http://localhost:4000/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username,password}),
            credentials: "include", // save cookies
        })
        if(!resp.ok){
            alert("Login failed");
        }
        else{
            resp.json().then((user) => {
                setUser(user);
                setRedirect(true);
            });
        }
    }
    if(redirect){
        // redirect to home page
        return <Navigate to={"/"}/>
    }

    return(
        <form onSubmit={login} className="login">
        <h1>Login</h1>
        <input type="text" placeholder="username" value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
        <input type="password" placeholder="password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
    );
}