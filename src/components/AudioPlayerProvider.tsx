import NetInfo from '@react-native-community/netinfo';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Video, { OnLoadData, OnProgressData, VideoRef } from 'react-native-video';
import { Song } from '../navigation/types';
import { checkFileExists, getSongFilePath } from '../services/downloader';

type AudioPlayerContextType = {
    currentSong: Song | null;
    songList: Song[];
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    isLocal: boolean;
    error: boolean;
    hasInternet: boolean;
    play: (song: Song, list?: Song[]) => void;
    pause: () => void;
    togglePlayback: () => void;
    handleNext: () => void;
    handlePrevious: () => void;
    handleSliderChange: (value: number) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [songList, setSongList] = useState<Song[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLocal, setIsLocal] = useState(false);
    const [error, setError] = useState(false);
    const [hasInternet, setHasInternet] = useState(true);
    const playerRef = useRef<VideoRef>(null);


    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setHasInternet(state.isConnected ?? false);
        });
        return () => unsubscribe();
    }, []);

    const play = async (song: Song, list: Song[] = []) => {
        try {
            setError(false);
            setIsLocal(false);
            const fileExists = await checkFileExists(song);
            setIsLocal(fileExists);
            setCurrentSong(song);
            setSongList(list.length > 0 ? list : [song]);
            setIsPlaying(true);
        } catch (err) {
            setError(true);
            console.error(err);
        }
    };

    const pause = () => setIsPlaying(false);
    const togglePlayback = () => setIsPlaying(!isPlaying);

    const handleNext = () => {
        if (!currentSong || songList.length === 0) return;
        const currentIndex = songList.findIndex(s => s.id === currentSong.id);
        const nextIndex = currentIndex < songList.length - 1 ? currentIndex + 1 : 0;
        play(songList[nextIndex], songList);
    };

    const handlePrevious = () => {
        if (!currentSong || songList.length === 0) return;
        const currentIndex = songList.findIndex(s => s.id === currentSong.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : songList.length - 1;
        play(songList[prevIndex], songList);
    };

    const handleSliderChange = (value: number) => {
        setCurrentTime(value);
        playerRef.current?.seek(value);
    };

    const handleLoad = (data: OnLoadData) => setDuration(data.duration);
    const handleProgress = (data: OnProgressData) => setCurrentTime(data.currentTime);
    const handleError = () => setError(true);

    return (
        <AudioPlayerContext.Provider
            value={{
                currentSong,
                songList,
                isPlaying,
                duration,
                currentTime,
                isLocal,
                error,
                hasInternet,
                play,
                pause,
                togglePlayback,
                handleNext,
                handlePrevious,
                handleSliderChange
            }}
        >
            {children}
            {currentSong && (
                <Video
                    ref={playerRef}
                    source={{
                        uri: isLocal
                            ? getSongFilePath(currentSong)
                            : `https://img.solt.gt/${currentSong.category}/${currentSong.id}_${currentSong.title.replace(/\s+/g, '_')}.mp3`
                    }}
                    paused={!isPlaying}
                    onLoad={handleLoad}
                    onProgress={handleProgress}
                    onError={handleError}
                    playInBackground={true}
                    playWhenInactive={true}
                    ignoreSilentSwitch="ignore"
                    style={{ width: 0, height: 0 }}
                />
            )}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
    return context;
};