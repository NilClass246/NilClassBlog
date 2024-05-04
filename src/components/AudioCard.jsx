

function AudioCard(){

    return (
        <div className='fixed audio-card bg-shion rounded'>
            <div className="p-3">正在播放: 夢幻能 〜 Taboo Marionette</div>
            <audio controls
            src="https://github.com/NilClass246/NilClassBlog/raw/master/dreamnoh.mp3" 
            type="audio/mpeg"
            className='h-5 rounded-none w-full'
            autoPlay 
            loop
            muted
            ></audio>
        </div>
    )
}

export default AudioCard;