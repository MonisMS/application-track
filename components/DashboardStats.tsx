type Stats = {
  total: number;
  replies: number;
  interviews: number;
  offers: number;
  replyRate: number;
  offerRate: number;
};

export default function DashboardStats({ stats }: { stats: Stats }) {
  const cards = [
    { label: "Total", value: stats.total },
    { label: "Replies", value: stats.replies },
    { label: "Interviews", value: stats.interviews },
    { label: "Offers", value: stats.offers },
    { label: "Reply Rate", value: `${stats.replyRate}%` },
    { label: "Offer Rate", value: `${stats.offerRate}%` },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 text-center"
        >
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            {card.value}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
