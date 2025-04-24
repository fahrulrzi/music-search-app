import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Track, TrackData } from '@/types/music'; // Pastikan path import ini sesuai

const popularArtists = [
    'Ed Sheeran',
    'Taylor Swift',
    'Coldplay',
    'Imagine Dragons'
];

export async function GET(req: NextRequest) {
    try {
        console.log(`Incoming request: ${req.url}`);
        const randomArtist = popularArtists[Math.floor(Math.random() * popularArtists.length)];

        const artistName = randomArtist;
        const response = await fetch(
            `https://theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistName.toLowerCase())}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from AudioDB API');
        }

        const data = await response.json();

        if (!data.artists) {
            return NextResponse.json([], { status: 200 });
        }

        const artistId = data.artists[0].idArtist;
        const tracksResponse = await fetch(
            `https://theaudiodb.com/api/v1/json/2/mvid.php?i=${artistId}`
        );

        if (!tracksResponse.ok) {
            throw new Error('Failed to fetch tracks from AudioDB API');
        }

        const tracksData = await tracksResponse.json();

        if (!tracksData.mvids) {
            return NextResponse.json([], { status: 200 });
        }

        const tracks: Track[] = tracksData.mvids.map((track: TrackData) => ({
            id: track.idTrack || track.strTrack,
            name: track.strTrack,
            artist: data.artists[0].strArtist,
            album: track.strAlbum || 'Unknown Album',
            duration: 0,
            imageUrl: track.strTrackThumb || data.artists[0].strArtistThumb || '/placeholder-album.jpg',
            previewUrl: '',
            youtubeId: track.strMusicVid ? track.strMusicVid.split('v=')[1] : ''
        }));

        return NextResponse.json(tracks, { status: 200 });
    } catch (error) {
        console.error('Error fetching from AudioDB API:', error);
        return NextResponse.json({ error: 'Failed to fetch popular music data' }, { status: 500 });
    }
}