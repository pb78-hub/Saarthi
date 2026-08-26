import Link from "next/link";
export default function Home() {
  return <section className="page hero">
    <p className="eyebrow">Public grievance filing and tracking</p>
    <h1>File a public grievance.</h1>
    <p className="lede">Describe the problem in your own words. Saarthi prepares it for filing — the correct department, a clear description, and a registration number to track it.</p>
    <div className="actions"><Link className="button ready" href="/file">File a grievance</Link><Link className="button secondary" href="/track">Track status</Link></div>
    <section className="how-it-works" aria-labelledby="how-it-works-title"><h2 id="how-it-works-title">How it works</h2><ol><li>Describe the problem, in your own words.</li><li>Review the department, location, and wording before you submit.</li><li>Submit and receive a registration number to track the case.</li></ol></section>
    <aside className="scope-note"><p className="eyebrow">Before you begin</p><p>Use this if you have a problem with the delivery of a public service. RTI requests, court proceedings, and private disputes between individuals are not handled through CPGRAMS.</p><Link href="/faq">See what is and isn&apos;t covered <span aria-hidden>→</span></Link></aside>
  </section>;
}
