import { Outlet } from "react-router-dom";
import Header from "./header"
import "./App.css";

export default function Layout() {
    return (
        <main>
        <Header/>
        <Outlet/>
        </main>
    );
}
