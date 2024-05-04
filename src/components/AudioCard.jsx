

function AudioCard(){

    return (
        <div className='fixed audio-card bg-shion rounded'>
            <div className="p-3">正在播放: 夢幻能 〜 Taboo Marionette</div>
            <audio controls
            src="./dreamnoh.mp3" 
            type="audio/mpeg"
            className='h-5 rounded-none w-full'
            autoPlay 
            loop
            ></audio>
        </div>
    )
}

export default AudioCard;