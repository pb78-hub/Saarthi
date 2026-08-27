import Link from "next/link";

function FileIcon() {
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 6h15l7 7v29H14z"/><path d="M29 6v8h7M20 23h10M20 29h10M20 35h6"/></svg>;
}

function TrackIcon() {
  return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="21" cy="21" r="11"/><path d="m29 29 9 9M17 21h8M21 17v8"/></svg>;
}

export default function Home() {
  return <section className="page hero">
    <p className="eyebrow">Public grievance filing and tracking · prototype</p>
    <h1>File a public grievance.</h1>
    <p className="lede">Describe the problem in your own words. Saarthi helps make it clear, routes it to the right public service, and gives you a simple way to follow up.</p>
    <div className="action-tiles" aria-label="Choose what you need to do">
      <Link className="action-tile file-action" href="/file">
        <span className="tile-icon"><FileIcon /></span>
        <span className="tile-copy"><strong>File a grievance</strong><small>Tell us what happened. No long form to start.</small></span>
        <span className="tile-arrow" aria-hidden="true">→</span>
      </Link>
      <Link className="action-tile track-action" href="/track">
        <span className="tile-icon"><TrackIcon /></span>
        <span className="tile-copy"><strong>Track your status</strong><small>See a plain-language update with your registration number.</small></span>
        <span className="tile-arrow" aria-hidden="true">→</span>
      </Link>
    </div>
    <p className="language-note">Choose your preferred language in the header. You can describe your issue in English, Hindi, or the language that feels natural to you.</p>
    <section className="how-it-works" aria-labelledby="how-it-works-title"><h2 id="how-it-works-title">A simpler way to be heard</h2><ol><li>Describe the problem, in your own words.</li><li>Review the department, location, and wording before you submit.</li><li>Submit and receive a registration number to track the case.</li></ol></section>
    <aside className="scope-note"><p className="eyebrow">Before you begin</p><p>Use this if you have a problem with the delivery of a public service. RTI requests, court proceedings, and private disputes between individuals are not handled through CPGRAMS.</p><Link href="/faq">See what is and isn&apos;t covered <span aria-hidden>→</span></Link></aside>
  </section>;
}
