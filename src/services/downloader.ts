import RNFS from 'react-native-fs';

const BASE_PATH = `${RNFS.ExternalDirectoryPath}/Música/Himnario`;

export const getCategoryPath = (category: 'himnos' | 'coros'): string => {
  return `${BASE_PATH}/${category}`;
};

export const getSongFilePath = (song: {
  id: string;
  title: string;
  category: 'himnos' | 'coros';
}): string => {
  const fileName = `${song.title.replace(/\s+/g, '%20')}`;
  return `${getCategoryPath(song.category)}/${fileName}.mp3`;
};

export const downloadFile = async (
  url: string,
  song: { id: string; title: string; category: 'himnos' | 'coros' },
  onProgress?: (progress: number) => void,
): Promise<{ filePath: string; skipped: boolean }> => {
  const categoryPath = getCategoryPath(song.category);
  const filePath = getSongFilePath(song);

  // Crear directorio si no existe
  await RNFS.mkdir(categoryPath);

  // Verificar si el archivo ya existe
  const fileExists = await RNFS.exists(filePath);
  if (fileExists) {
    return { filePath, skipped: true };
  }

  const options = {
    fromUrl: url,
    toFile: filePath,
    progress: (res: any) => {
      const progressPercent = (res.bytesWritten / res.contentLength) * 100;
      onProgress?.(progressPercent);
    },
  };

  const response = await RNFS.downloadFile(options).promise;

  if (response.statusCode === 200) {
    return { filePath, skipped: false };
  }
  throw new Error(`Download failed with status ${response.statusCode}`);
};

export const checkFileExists = async (song: {
  id: string;
  title: string;
  category: 'himnos' | 'coros';
}): Promise<boolean> => {
  const filePath = getSongFilePath(song);
  return RNFS.exists(filePath);
};

export const downloadAllSongs = async (
  songs: Array<{ id: string; title: string; category: 'himnos' | 'coros' }>,
  onProgress?: (
    current: number,
    total: number,
    song: { id: string; title: string },
  ) => void,
): Promise<
  {
    success: boolean;
    skipped: boolean;
    song: { id: string; title: string };
    error?: Error;
  }[]
> => {
  const results = [];
  console.log(songs);
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    console.log('X');
    try {
      const url = `https://img.solt.gt/${song.category}/${song.title.replace(
        /\s+/g,
        '%20',
      )}.mp3`;
      const { skipped } = await downloadFile(url, song);
      results.push({ success: true, skipped, song });
    } catch (error) {
      results.push({
        success: false,
        skipped: false,
        song,
        error: error as Error,
      });
    }

    onProgress?.(i + 1, songs.length, song);
  }

  return results;
};

export const deleteDownloadedFile = async (song: {
  id: string;
  title: string;
  category: 'himnos' | 'coros';
}): Promise<void> => {
  const filePath = getSongFilePath(song);
  if (await RNFS.exists(filePath)) {
    await RNFS.unlink(filePath);
  }
};
