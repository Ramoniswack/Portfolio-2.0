"use client"

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareOnTwitter = () => {
    const text = `Check out this blog post: ${title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={shareOnTwitter}
        className="w-10 h-10 rounded-full bg-accent/10 hover:bg-accent/20 flex items-center justify-center text-accent hover:text-accent/80 transition-all duration-200 hover:scale-105 cursor-pointer"
        data-pointer="interactive"
        title="Share on Twitter"
      >
        <span className="text-sm font-semibold">𝕏</span>
      </button>
      <button 
        onClick={shareOnLinkedIn}
        className="w-10 h-10 rounded-full bg-accent/10 hover:bg-accent/20 flex items-center justify-center text-accent hover:text-accent/80 transition-all duration-200 hover:scale-105 cursor-pointer"
        data-pointer="interactive"
        title="Share on LinkedIn"
      >
        <span className="text-sm font-semibold">in</span>
      </button>
    </div>
  );
}
