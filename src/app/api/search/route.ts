import { Track, TrackData } from '@/types/music';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query || typeof query !== 'string') {
        return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const response = await fetch(
            `https://theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from AudioDB API');
        }

        const data = await response.json();

        if (!data.artists) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
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
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
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

        return new Response(JSON.stringify(tracks), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching from AudioDB API:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch music data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
