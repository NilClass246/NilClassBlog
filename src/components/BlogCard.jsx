function BlogCard({title, desc}){
    return (
        <div className="p-3">
            <div className="text-xl font-bold">
                {title}
            </div>
            <div>
                {desc}
            </div>
        </div>
    )
}

export default BlogCard;