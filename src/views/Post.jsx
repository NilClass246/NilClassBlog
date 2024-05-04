import { marked } from "marked";
import { useState } from "react";

function fetchPost(){
    let target = "https://raw.githubusercontent.com/NilClass246/NilClassBlog/master/README.md?token=GHSAT0AAAAAACRWV6NVTKBQN3E6AROWULLMZRVPEJQ";
    return fetch(target).then(res=>{
        return res.text();
    })
}

export default function Post() {
    const [post, setPost] = useState("Loading...");
    fetchPost().then(res=>{
        setPost(marked.parse(res));
        // post = marked.parse(res);
        // console.log(post);
    })

    return (
      <div className="p-6">
      <div dangerouslySetInnerHTML={{__html: post}}>
      </div>
      </div>
    );
  }