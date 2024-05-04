import { marked } from "marked";
import { useState } from "react";
import { useParams } from 'react-router-dom';

function fetchPost(id){
    let target = `https://raw.githubusercontent.com/NilClass246/NilClassBlog/master/src/data/${id}.html`;
    return fetch(target).then(res=>{
        return res.text();
    })
}

export default function Post() {
    let { id } = useParams();
    const [post, setPost] = useState("Loading...");
    fetchPost(id).then(res=>{
        setPost(marked.parse(res));
    })

    return (
      <div className="p-6">
      <div dangerouslySetInnerHTML={{__html: post}}>
      </div>
      </div>
    );
  }