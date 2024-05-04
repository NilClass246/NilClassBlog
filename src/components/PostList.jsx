import BlogCard from "./BlogCard";
import Posts from "../data/postlist.json";

function PostList(){
    return (
        <>
            <div className="m-3">
                {Posts.Records.map(e=>(
                <div key={e.id}>
                    <hr className="border-black"></hr>
                    <BlogCard title={e.title} desc={e.description}></BlogCard>
                </div>
                
            ))}
            </div>
        </>
    )
}

export default PostList;