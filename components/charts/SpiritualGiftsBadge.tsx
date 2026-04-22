export function SpiritualGiftsBadge({
  result,
}: {
  result: { primary: string; secondary: string[] };
}) {
  const giftEmojis: Record<string, string> = {
    Mercy: '💙',
    Teaching: '📖',
    Encouragement: '🌟',
    Prophecy: '🔥',
    Leadership: '👑',
    Administration: '📋',
    Evangelism: '📢',
    Hospitality: '🏠',
    Intercession: '🙏',
    Healing: '✨',
    Miracles: '⚡',
    Discernment: '👁️',
    Giving: '🎁',
    Craftsmanship: '🎨',
    Default: '✨',
  };

  const primaryEmoji = giftEmojis[result.primary] || giftEmojis.Default;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-4xl">{primaryEmoji}</div>
      <div className="text-center">
        <div className="font-semibold text-navy-900 text-sm">{result.primary}</div>
        <div className="text-xs text-charcoal-600 mt-1">Primary Gift</div>
      </div>
      {result.secondary && result.secondary.length > 0 && (
        <div className="text-xs text-charcoal-600 text-center">
          <div className="font-semibold text-charcoal-700 mt-2">Also:</div>
          {result.secondary.map((gift) => (
            <div key={gift} className="text-xs">
              {gift}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
