import reviewData from '@/lib/reviews.json';

export default function ReviewStrip() {
  const { stats } = reviewData;

  return (
    <a
      href={stats.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm text-[#00ff00]/80 hover:text-[#00ff00] transition-colors"
    >
      <span className="text-[#00ff00]" aria-label={`${stats.rating} out of 5 stars`}>
        ★★★★★
      </span>
      <span>
        Top Rated Plus on Upwork · {stats.jobSuccessScore}% Job Success · {stats.totalEarnings} earned
      </span>
    </a>
  );
}
