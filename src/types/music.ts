export interface Track {
    id: string;
    name: string;
    artist: string;
    album: string;
    duration: number;
    imageUrl: string;
    previewUrl: string;
    youtubeId?: string;
}


export interface TrackData {
    idTrack?: string;
    strTrack: string;
    strAlbum?: string;
    strTrackThumb?: string;
    strMusicVid?: string;
}