import { marked } from "marked";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import BlogHeader from "../components/BlogHeader";

function fetchPost(id){
    let target = `https://raw.githubusercontent.com/NilClass246/NilClassBlog/master/src/data/${id}.md`;
    return fetch(target).then(res=>{
        return res.text();
    })
}

export default function Post() {
    let { id } = useParams();
    const [post, setPost] = useState("Loading...");
    fetchPost(id).then(res=>{
        setPost(marked.parse(res));
        window.MathJax.typeset();

    })

    return (
    <>
        <BlogHeader></BlogHeader>
        <div className="p-6 text-black">
        <div dangerouslySetInnerHTML={{__html: post}}>
        </div>
        </div>
    </>
    );
  }