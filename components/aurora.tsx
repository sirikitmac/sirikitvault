/**
 * Ambient aurora field. Pure CSS: four radial-gradient blobs drifting on a
 * fixed compositor layer via `transform` @keyframes (see globals.css). No
 * canvas, no rAF, no scroll listener — motion cost is a one-time paint per
 * blob, then GPU-composited translate/scale for the life of the page.
 *
 * `mask-image` (globals.css `.aurora-field`) fades it down sharply below the
 * hero so it stays a calm backdrop, not a distraction, behind the card grid.
 */
export function Aurora() {
  return (
    <div className="aurora-field pointer-events-none fixed inset-0 -z-20" aria-hidden="true">
      <div className="aurora-blob aurora-blob-a" />
      <div className="aurora-blob aurora-blob-b" />
      <div className="aurora-blob aurora-blob-c" />
      <div className="aurora-blob aurora-blob-d" />
    </div>
  );
}
