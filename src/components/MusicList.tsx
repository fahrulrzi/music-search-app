import { Track } from "../types/music";
import YoutubeEmbed from "./YoutubeEmbed";

interface MusicListProps {
  tracks: Track[];
}

export default function MusicList({ tracks }: MusicListProps) {
  if (tracks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tracks found. Try searching for a different artist.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <div key={track.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <img
              src={track.imageUrl || "/placeholder-album.jpg"}
              alt={`${track.name} cover`}
              className="w-full h-48 object-cover rounded"
            />
          </div>
          <h3 className="font-bold text-lg truncate">{track.name}</h3>
          <p className="text-gray-600 truncate">{track.artist}</p>
          <p className="text-gray-500 text-sm mb-3">{track.album}</p>

          {track.youtubeId && <YoutubeEmbed youtubeId={track.youtubeId} />}
        </div>
      ))}
    </div>
  );
}
