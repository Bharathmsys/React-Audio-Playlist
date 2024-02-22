import React from 'react'
import { useState,useEffect } from 'react';
import "../Components/Audiofile.css"
const Audiofile = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [audioRef, setAudioRef] = useState(null);
  
    useEffect(() => {
      const storedPlaylist = JSON.parse(localStorage.getItem('playlist'));
      if (storedPlaylist) {
        setPlaylist(storedPlaylist);
      }
      const lastTrackIndex = parseInt(localStorage.getItem('currentTrackIndex'), 10);
      if (!isNaN(lastTrackIndex) && lastTrackIndex >= 0 && lastTrackIndex < playlist.length) {
        setCurrentTrackIndex(lastTrackIndex);
      }
    },[]);
  
    useEffect(() => {
      localStorage.setItem('playlist', JSON.stringify(playlist));
      localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
    }, [playlist, currentTrackIndex]);
  
    const handleFileChange = (event) => {
      const files = event.target.files;
      const newPlaylist = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        newPlaylist.push({
          name: file.name,
          url: URL.createObjectURL(file)
        });
      }
      setPlaylist([...playlist, ...newPlaylist]);
    };
  
    const playTrack = (index) => {
      setCurrentTrackIndex(index);
      audioRef.currentTime = 0;
      audioRef.play();
    };
  
    const handleEnded = () => {
      if (currentTrackIndex < playlist.length - 1) {
        playTrack(currentTrackIndex + 1);
      }
    };
  return (
    <div className='audio-container'>
        <h1 className='title'>Audio Playlist</h1>
        <input className='audio-input' type="file" accept="audio/mp3" onChange={handleFileChange} multiple />
      <div className='sub-container'>
        {playlist.map((track, index) => (
          <div key={index}>
            <button className='audio-playing-button' onClick={() => playTrack(index)}>
              {index === currentTrackIndex ? 'Now Playing: ' : ''}
              {track.name}
            </button>
          </div>
        ))}
      </div>
      <audio
        ref={(ref) => setAudioRef(ref)}
        src={playlist[currentTrackIndex]?.url}
        controls
        onEnded={handleEnded}
      />
      
    </div>
  )
}

export default Audiofile
