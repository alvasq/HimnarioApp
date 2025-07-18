import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Song } from '../navigation/types';

type SongItemProps = {
    song: Song;
    onPress: () => void;
    isPlaying?: boolean;
};

const SongItem: React.FC<SongItemProps> = ({ song, onPress, isPlaying = false }) => {
    const isDownloaded = song.downloaded ?? false;

    return (
        <TouchableOpacity
            style={[styles.container, isPlaying && styles.playingContainer]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.songInfo}>
                <Text
                    style={[styles.songTitle, isPlaying && styles.playingText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {song.title}
                </Text>
                <View style={styles.songMeta}>
                </View>
            </View>

            {isPlaying ? (
                <Icon name="play-arrow" size={24} color="#555" />
            ) : (
                <Icon
                    name={isDownloaded ? 'check-circle' : 'cloud-download'}
                    size={24}
                    color={isDownloaded ? '#4CAF50' : '#555555'}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        backgroundColor: '#ffffff',
    },
    playingContainer: {
        backgroundColor: '#f0f0f0',
    },
    songInfo: {
        flex: 1,
        marginRight: 15,
    },
    songTitle: {
        fontSize: 16,
        color: '#333333',
        fontWeight: 'normal',
        marginBottom: 2,
    },
    playingText: {
        color: '#555',
        fontWeight: '500',
    },
    songMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    songArtist: {
        fontSize: 14,
        color: '#666666',
    },
    songDuration: {
        fontSize: 14,
        color: '#888888',
    },
});

export default SongItem;