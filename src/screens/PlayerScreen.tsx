import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAudioPlayer } from '../components/AudioPlayerProvider';
import { PlayerScreenRouteProp } from '../navigation/types';

type RepeatMode = 'none' | 'one' | 'all';

const PlayerScreen = () => {
    const route = useRoute<PlayerScreenRouteProp>();
    const navigation = useNavigation();
    const {
        currentSong,
        isPlaying,
        play,
        pause,
        togglePlayback,
        duration,
        currentTime,
        handleSliderChange,
        handleNext,
        handlePrevious,
        isLocal,
        error,
        hasInternet
    } = useAudioPlayer();

    const [shuffle, setShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (route.params.song) {
            play(route.params.song, route.params.songList);
        }
    }, [route.params.song]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleShuffle = () => setShuffle(!shuffle);

    const toggleRepeatMode = () => {
        const modes: RepeatMode[] = ['none', 'one', 'all'];
        const currentIndex = modes.indexOf(repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setRepeatMode(modes[nextIndex]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.songInfo}>
                <View style={styles.albumArt}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#555" />
                    ) : error ? (
                        <Icon name="error-outline" size={60} color="#ff4444" />
                    ) : (
                        <Icon name="music-note" size={80} color="#888" />
                    )}
                </View>

                <View style={styles.sourceIndicator}>
                    <Icon
                        name={isLocal ? 'check-circle' : 'cloud'}
                        size={16}
                        color={isLocal ? '#4CAF50' : '#2196F3'}
                    />
                    <Text style={styles.sourceText}>
                        {isLocal ? 'Reproduciendo local' : 'Reproduciendo desde internet'}
                    </Text>
                </View>

                <Text style={styles.songTitle}>{currentSong?.title}</Text>

                <View style={styles.progressContainer}>
                    <Slider
                        style={styles.progressBar}
                        minimumValue={0}
                        maximumValue={duration || 1}
                        value={currentTime}
                        onSlidingComplete={handleSliderChange}
                        minimumTrackTintColor="#555"
                        maximumTrackTintColor="#e0e0e0"
                        thumbTintColor="#555"
                        disabled={error || isLoading}
                    />
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handlePrevious}
                    disabled={error || isLoading}
                >
                    <Icon name="skip-previous" size={32} color={error || isLoading ? "#ccc" : "#555"} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.playButton, (error || isLoading) && styles.disabledButton]}
                    onPress={togglePlayback}
                    disabled={error || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Icon
                            name={isPlaying ? 'pause' : 'play-arrow'}
                            size={32}
                            color="#fff"
                        />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleNext}
                    disabled={error || isLoading}
                >
                    <Icon name="skip-next" size={32} color={error || isLoading ? "#ccc" : "#555"} />
                </TouchableOpacity>
            </View>

            <View style={styles.secondaryControls}>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={toggleShuffle}
                    disabled={error || isLoading}
                >
                    <Icon
                        name="shuffle"
                        size={24}
                        color={shuffle ? "#555" : (error || isLoading ? "#ccc" : "#777")}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={toggleRepeatMode}
                    disabled={error || isLoading}
                >
                    <Icon
                        name={repeatMode === 'one' ? 'repeat-one' : 'repeat'}
                        size={24}
                        color={repeatMode !== 'none' ? "#555" : (error || isLoading ? "#ccc" : "#777")}
                    />
                </TouchableOpacity>
            </View>

            {error && (
                <Text style={styles.errorText}>
                    {!hasInternet && !isLocal
                        ? 'No hay conexión a internet y la canción no está descargada'
                        : 'Error al cargar el audio. Verifica tu conexión o la URL del recurso.'}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    audioElement: {
        width: 0,
        height: 0,
        position: 'absolute',
    },
    songInfo: {
        alignItems: 'center',
        marginBottom: 40,
    },
    albumArt: {
        width: 220,
        height: 220,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    sourceIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sourceText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    songTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
        textAlign: 'center',
    },
    songArtist: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 40,
    },
    progressBar: {
        width: '100%',
        height: 40,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    timeText: {
        fontSize: 12,
        color: '#888',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    controlButton: {
        marginHorizontal: 25,
    },
    playButton: {
        backgroundColor: '#555',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    secondaryControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 40,
    },
    secondaryButton: {
        padding: 10,
    },
    errorText: {
        color: '#ff4444',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
    },
});

export default PlayerScreen;