import reviewData from '@/lib/reviews.json';

export default function ReviewsSection() {
  const { reviews, stats } = reviewData;

  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-sm uppercase tracking-widest text-[#00ff00]/60 text-center mb-3">
          Client feedback
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-[#00ff00]">
          Verified Upwork Reviews
        </h2>
        <p className="text-center text-[#00ff00]/70 mb-12 max-w-2xl mx-auto">
          Real feedback from real clients — {stats.totalContracts} contracts completed with {stats.jobSuccessScore}% job success.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-[#00ff00]/20 rounded-lg p-6 bg-[#1a1a1a] hover:border-[#00ff00]/40 transition-colors flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#00ff00] text-sm" aria-label={`${review.score} out of 5 stars`}>
                  ★★★★★
                </span>
                <span className="text-xs text-[#00ff00]/60">{review.score}/5</span>
              </div>

              <blockquote className="text-[#00ff00]/70 text-sm leading-relaxed mb-4 flex-1">
                &ldquo;{review.comment}&rdquo;
              </blockquote>

              <div className="border-t border-[#00ff00]/10 pt-3 mt-auto">
                <p className="text-xs font-semibold text-[#00ff00]/80">{review.projectTitle}</p>
                <p className="text-xs text-[#00ff00]/60">{review.totalCharge} · {review.endDate}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={stats.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#00ff00]/30 text-[#00ff00]/70 rounded hover:bg-[#00ff00]/10 hover:text-[#00ff00] transition-colors"
          >
            View full profile on Upwork &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
