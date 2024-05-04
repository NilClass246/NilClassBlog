import BlogCard from "./BlogCard";
import Posts from "../data/postlist.json";

function PostList(){
    return (
        <>
            <div className="m-3">
                {Posts.Records.map(e=>(
                <div key={e.id}>
                    <BlogCard title={e.title} desc={e.description}></BlogCard>
                    {e.id != Posts.Records[Posts.Records.length-1].id? <hr className="border-black"></hr>: <></>}
                </div>
                
            ))}
            </div>
        </>
    )
}

export default PostList;