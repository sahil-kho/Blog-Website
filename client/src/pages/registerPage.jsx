import React, { useState } from "react";
import { Navigate } from "react-router-dom";

export default function RegisterPage() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [redirect,setRedirect] = useState(false);

    async function register(e) {
        e.preventDefault();

        const response = await fetch("http://localhost:4000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username,password}),
        });
        if(!response.ok){
            alert("Registeration failed");
        }
        else{
            setRedirect(true);
            setUsername("");
            setPassword("");
            alert("Registeration successful");
        }
}

    if(redirect){
        return <Navigate to={"/"}/>
    }


    return(
        <form onSubmit={register} className="register">
        <h1>Register</h1>
        <input type="text" placeholder="username" value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
        <input type="password" placeholder="password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button>Register</button>
      </form>
    );
}