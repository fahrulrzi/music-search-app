interface YoutubeEmbedProps {
  youtubeId: string;
}

export default function YoutubeEmbed({ youtubeId }: YoutubeEmbedProps) {
  if (!youtubeId) return null;

  return (
    <div className="aspect-w-16 aspect-h-9 mt-3">
      <iframe
        width="100%"
        height="200"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded YouTube"
        className="rounded"></iframe>
    </div>
  );
}
