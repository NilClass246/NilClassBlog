import { useNavigate } from "react-router-dom";

function BlogCard({id, title, desc}){
    const navigate = useNavigate();
    const url = `/post/${id}`

    return (
        <div className="p-3">
            <div className="text-xl font-bold cursor-pointer shake" onClick={()=>{navigate(url);}}>
                {title}
            </div>
            <div>
                {desc}
            </div>
        </div>
    )
}

export default BlogCard;