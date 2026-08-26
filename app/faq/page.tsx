const questions = [
  ["What can I use a public grievance for?", "Use it when a government service has not been delivered, has been delayed, or needs to be corrected — for example water supply, a railway refund, a pension, a ration card, or a road safety issue."],
  ["What should not be filed here?", "CPGRAMS does not take up RTI matters, court or subjudice matters, personal or family disputes, or issues that affect the country’s territorial integrity or foreign relations."],
  ["Do I need a special format?", "No. CPGRAMS states that there is no prescribed format. Explain what happened, where it happened, when it started, and what you need fixed. Saarthi turns those details into a clear draft."],
  ["What happens after I submit?", "A grievance is acknowledged and given a unique registration number. It is then forwarded to the Ministry, Department, State, or Union Territory responsible for that service."],
  ["How long should redress take?", "The standard time limit is 21 days. If it will take longer, the department should provide an interim reply explaining the delay."],
  ["What if I am not satisfied with the outcome?", "After a grievance is disposed, you can give feedback. If you rate it Poor, an appeal option is enabled; the appeal must be filed within 30 days."],
  ["Can I reopen a closed grievance?", "No. File a fresh grievance and refer to the old registration number. This gives the department the context it needs without losing the new request."],
];
export default function FaqPage() { return <section className="page"><div className="faq-wrap"><p className="eyebrow">Help with the process</p><h1 className="page-title">What to expect, before you file.</h1><p className="subhead">The practical parts of CPGRAMS, written for the person who needs help — not the person who already knows the system.</p><div className="faq-list">{questions.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></div></section>; }
