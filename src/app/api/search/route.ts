import { Track, TrackData } from '@/types/music';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function GET(
    req: NextApiRequest,
    res: NextApiResponse<Track[] | { error: string }>
) {

    const { query } = req.query;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        // AudioDB API - search by artist name
        const response = await fetch(
            `https://theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from AudioDB API');
        }

        const data = await response.json();

        // If no artists found
        if (!data.artists) {
            return res.status(200).json([]);
        }

        // Get tracks for the first artist found
        const artistId = data.artists[0].idArtist;
        const tracksResponse = await fetch(
            `https://theaudiodb.com/api/v1/json/2/mvid.php?i=${artistId}`
        );

        if (!tracksResponse.ok) {
            throw new Error('Failed to fetch tracks from AudioDB API');
        }

        const tracksData = await tracksResponse.json();

        // If no tracks found
        if (!tracksData.mvids) {
            return res.status(200).json([]);
        }

        const tracks: Track[] = tracksData.mvids.map((track: TrackData) => ({
            id: track.idTrack || track.strTrack,
            name: track.strTrack,
            artist: data.artists[0].strArtist,
            album: track.strAlbum || 'Unknown Album',
            duration: 0, // AudioDB doesn't provide duration in this endpoint
            imageUrl: track.strTrackThumb || data.artists[0].strArtistThumb || '/placeholder-album.jpg',
            previewUrl: '',
            youtubeId: track.strMusicVid ? track.strMusicVid.split('v=')[1] : ''
        }));

        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error fetching from AudioDB API:', error);
        res.status(500).json({ error: 'Failed to fetch music data' });
    }
}
