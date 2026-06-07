export function ScrollBackground({
  images,
}: {
  images: string[]
  activeIndex?: number
}) {
  const src = images[0]

  return (
    <div className="absolute inset-x-0 -top-35 h-screen z-0 overflow-hidden bg-background">
      {src && (
        <div className="absolute inset-0">
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-bottom saturate-[1.05]"
          />
          {/* Light tint overlay on the photo for text readability */}
          <div className="absolute inset-0 bg-black/15" />
        </div>
      )}

      {/* Fade overlay: fades the image into the dark page background at its bottom edge */}
      <div className="absolute top-0 inset-x-0 h-screen bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Soft cinematic vignette over the entire screen */}
      <div className="absolute inset-0 bg-[radial-gradient(110%_110%_at_50%_45%,transparent_60%,oklch(0.1_0.01_60/0.35)_100%)] pointer-events-none" />

      {/* Top gradient for header legibility */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />

      {/* Subtle film grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
