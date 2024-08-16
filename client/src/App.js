import "./App.css";
// import Header from "./header";
import Layout from "./layout";
// import Post from "./post";
import IndexPage from "./pages/indexPage";
import { Route,Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import { UserContextProvider } from "./userContext";
import CreatePost from "./pages/createPost";
import PostPage from "./pages/postpage";
import EditPost from "./pages/editpost";


function App() {
  return (
    <UserContextProvider>
    <Routes>
    <Route path="/" element={<Layout/>}>
    <Route index element={<IndexPage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route path="/create" element={<CreatePost/>}/>
    <Route path="/post/:id" element={<PostPage/>}/>
    <Route path="/edit/:id" element={<EditPost/>}/>
    </Route>
    </Routes>
    </UserContextProvider>

  );
}

export default App;

