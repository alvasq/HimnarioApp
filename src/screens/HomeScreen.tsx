import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAudioPlayer } from '../components/AudioPlayerProvider';
import SongItem from '../components/SongItem';
import { HomeScreenNavigationProp } from '../navigation/types';
import { checkFileExists, downloadAllSongs } from '../services/downloader';

type Song = {
    id: string;
    title: string;
    artist: string;
    duration: string;
    category: 'himnos' | 'coros';
    downloaded?: boolean;

};

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
    const [activeTab, setActiveTab] = useState<'himnos' | 'coros'>('himnos');
    const [downloadProgress, setDownloadProgress] = useState<{ current: number, total: number } | null>(null);
    const [allDownloaded, setAllDownloaded] = useState(false);
    const [songs, setSongs] = useState<Record<'himnos' | 'coros', Song[]>>({
        himnos: [
            {
                id: '1',
                title: '039 Cristo dice',
                artist: 'Anónimo',
                duration: '2:45',
                category: 'coros',
                downloaded: false
            },
            {
                id: '2',
                title: 'Santo, Santo, Santo',
                artist: 'Anónimo',
                duration: '3:20',
                category: 'himnos',
                downloaded: false,

            }
        ],
        coros: [
            {
                id: '001',
                title: 'Levante la bandera',
                artist: '',
                duration: '1:50',
                category: 'coros',
                downloaded: false
            },
            {
                id: '002',
                title: 'Mirad que por los frutos',
                artist: '',
                duration: '1:50',
                category: 'coros',
                downloaded: false
            },
        ]
    });

    const { currentSong, isPlaying } = useAudioPlayer();

    useEffect(() => {
        const checkDownloads = async () => {
            const currentSongs = songs[activeTab];
            let allExist = true;

            const updatedSongs = await Promise.all(currentSongs.map(async song => {
                const exists = await checkFileExists(song);
                if (!exists) allExist = false;
                return { ...song, downloaded: exists };
            }));

            setSongs(prev => ({ ...prev, [activeTab]: updatedSongs }));
            setAllDownloaded(allExist);
        };

        checkDownloads();
    }, [activeTab]);

    const handleDownloadAll = async () => {
        try {
            setDownloadProgress({ current: 0, total: songs[activeTab].length });

            await downloadAllSongs(
                songs[activeTab],
                (current, total) => {
                    setDownloadProgress({ current, total });
                }
            );

            const updatedSongs = await Promise.all(songs[activeTab].map(async song => {
                const exists = await checkFileExists(song);
                return { ...song, downloaded: exists };
            }));

            setSongs(prev => ({ ...prev, [activeTab]: updatedSongs }));
            setAllDownloaded(true);
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al descargar las canciones');
            console.error(error);
        } finally {
            setDownloadProgress(null);
        }
    };

    const handleSongPress = (song: Song) => {
        navigation.navigate('Player', {
            song: song,
            songList: songs[activeTab]
        });
    };

    const handleNowPlayingPress = () => {
        if (currentSong) {
            navigation.navigate('Player', {
                song: currentSong,
                songList: songs[activeTab]
            });
        }
    };

    return (
        <View style={styles.container}>
            {currentSong && (
                <TouchableOpacity
                    style={styles.nowPlayingContainer}
                    onPress={handleNowPlayingPress}
                >
                    <View style={styles.nowPlayingContent}>
                        <Icon name="music-note" size={20} color="#555" />
                        <Text style={styles.nowPlayingText} numberOfLines={1}>
                            {isPlaying ? 'Reproduciendo:' : 'Pausado:'} {currentSong.title}
                        </Text>
                        <Icon name={isPlaying ? "pause" : "play-arrow"} size={20} color="#555" />
                    </View>
                </TouchableOpacity>
            )}

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'himnos' && styles.activeTab]}
                    onPress={() => setActiveTab('himnos')}
                >
                    <Text style={[styles.tabText, activeTab === 'himnos' && styles.activeTabText]}>Himnos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'coros' && styles.activeTab]}
                    onPress={() => setActiveTab('coros')}
                >
                    <Text style={[styles.tabText, activeTab === 'coros' && styles.activeTabText]}>Coros</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={songs[activeTab]}
                renderItem={({ item }) => (
                    <SongItem
                        song={item}
                        onPress={() => handleSongPress(item)}
                        isPlaying={currentSong?.id === item.id}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />

            {!allDownloaded && (
                <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={handleDownloadAll}
                    disabled={!!downloadProgress}
                >
                    {downloadProgress ? (
                        <View style={styles.downloadProgressContainer}>
                            <Icon name="cloud-download" size={20} color="white" />
                            <Text style={styles.downloadText}>
                                {downloadProgress.current}/{downloadProgress.total}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.downloadText}>DESCARGAR TODOS</Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    nowPlayingContainer: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    nowPlayingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nowPlayingText: {
        flex: 1,
        marginHorizontal: 10,
        color: '#555',
        fontSize: 14,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#555555',
    },
    tabText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#333333',
    },
    listContent: {
        paddingBottom: 70,
    },
    downloadButton: {
        position: 'absolute',
        bottom: 16,
        left: 20,
        right: 20,
        backgroundColor: '#555555',
        borderRadius: 4,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    downloadProgressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    downloadText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase',
    },
});

export default HomeScreen;