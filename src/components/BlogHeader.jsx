import { useNavigate } from "react-router-dom";

function BlogHeader(){
    const navigate = useNavigate();

    return (
        <div className="relative p-6 header shadow-lg rounded-sm bg-book z-20 text-slate-500 h-48">
            <div className="text-4xl mb-2 font-bold cursor-pointer shake" onClick={()=>{navigate("/");}}>深秘图书</div>
            <div className="text-sm">Occultism Library</div>
        </div>
    );
}

export default BlogHeader;