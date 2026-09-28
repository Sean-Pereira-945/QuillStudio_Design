/**
 * Wet-ink smudge under the navbar.
 * Four stacked progressive blur strips, each masked to fade out lower down, plus a paper tint.
 * Text passing under the navbar blurs more the closer it gets to the top, then clears.
 * This is an approximation: a true ink smear is not reliable across browsers.
 * Browsers without backdrop-filter simply get the tint.
 */
export function SmudgeLayer() {
  return (
    <div className="smudge" aria-hidden="true">
      <div className="s1" />
      <div className="s2" />
      <div className="s3" />
      <div className="s4" />
      <div className="tint" />
    </div>
  );
}
