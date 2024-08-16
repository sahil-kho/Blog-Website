import { useEffect, useState } from "react";
import Post from "../post";

export default function IndexPage(){
    const [posts,setPosts] = useState([]);
    useEffect(() => {
      fetch('http://localhost:4000/posts').then(response => {
        response.json().then(posts => {
          setPosts(posts);
            // console.log(posts);
        });
      });
    }, []);
    return (
        // <Post/>
      <>
        {posts.length > 0 && posts.map(post => (
          <Post {...post} key={post.id} />
        ))}
      </>
    );
}