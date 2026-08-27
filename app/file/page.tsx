"use client";

import { FormEvent, useState } from "react";
import {
  HealthField,
  GrievanceDraft,
  ChatTurn,
} from "@/types/grievance";
import { HealthScoreSeal } from "@/components/HealthScoreSeal";

const API_URL = "http://127.0.0.1:8000";

// ============================================================
// EMPTY DRAFT
// ============================================================

const blank: GrievanceDraft = {
  summary: null,
  fullText: null,
  location: null,
  department: null,
  dateOrTimeframe: null,
  desiredOutcome: null,
};


// ============================================================
// HEALTH SCORE FIELDS
// ============================================================

function captured(draft: GrievanceDraft): HealthField[] {
  const fields: HealthField[] = [];

  if (draft.summary) {
    fields.push("issueDescribed");
  }

  if (draft.location) {
    fields.push("location");
  }

  if (draft.department) {
    fields.push("department");
  }

  if (draft.dateOrTimeframe) {
    fields.push("dateOrTimeframe");
  }

  if (
    draft.fullText &&
    draft.fullText.length > 100
  ) {
    fields.push("supportingDetail");
  }

  return fields;
}


// ============================================================
// PAGE
// ============================================================

export default function FilePage() {

  // ----------------------------------------------------------
  // CHAT HISTORY
  // ----------------------------------------------------------

  const [history, setHistory] = useState<ChatTurn[]>([
    {
      role: "assistant",
      content:
        "Namaste! Main Saarthi hoon. Aap apni problem apne words mein bataiye. Hindi, English ya Hinglish mein bata sakte hain.",
    },
  ]);


  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [text, setText] = useState("");

  const [draft, setDraft] =
    useState<GrievanceDraft>(blank);

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  const [registration, setRegistration] =
    useState<string | null>(null);

  const [readinessScore, setReadinessScore] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [authority, setAuthority] =
    useState<string | null>(null);


  // ----------------------------------------------------------
  // HEALTH
  // ----------------------------------------------------------

  const health = captured(draft);


  // ----------------------------------------------------------
  // READY FOR SUBMISSION
  // ----------------------------------------------------------

  const ready = Boolean(
    readinessScore >= 90 &&
    draft.fullText &&
    sessionId &&
    !registration
  );


  // ==========================================================
  // SEND CHAT MESSAGE
  // ==========================================================

  const send = async (
    event: FormEvent
  ) => {

    event.preventDefault();

    if (!text.trim() || loading) {
      return;
    }


    const userMessage = text.trim();


    // Add user message immediately

    setHistory((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
      },
    ]);


    setText("");
    setLoading(true);
    setError("");


    try {

      // ------------------------------------------------------
      // CALL FASTAPI BACKEND
      // ------------------------------------------------------

      const response = await fetch(
        `${API_URL}/api/saarthi`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            session_id: sessionId,
            message: userMessage,
            preferred_language: "hinglish",
          }),
        }
      );


      if (!response.ok) {

        const errorData =
          await response.json()
            .catch(() => null);

        throw new Error(
          errorData?.detail ||
          "Backend request failed"
        );
      }


      const data =
        await response.json();


      // ------------------------------------------------------
      // SAVE SESSION
      // ------------------------------------------------------

      if (data.session_id) {
        setSessionId(
          data.session_id
        );
      }


      // ------------------------------------------------------
      // SAVE READINESS SCORE
      // ------------------------------------------------------

      setReadinessScore(
        data.readiness_score || 0
      );


      // ------------------------------------------------------
      // SAVE AUTHORITY
      // ------------------------------------------------------

      setAuthority(
        data.concerned_authority || null
      );


      // ------------------------------------------------------
      // UPDATE CASE FILE
      // ------------------------------------------------------

      setDraft({
        summary:
          data.summary || null,

        fullText:
          data.grievance_draft || null,

        location:
          data.collected_information?.location ||
          null,

        department:
          data.concerned_authority ||
          data.problem_display ||
          data.problem_type ||
          null,

        dateOrTimeframe:
          data.collected_information?.duration ||
          null,

        desiredOutcome:
          null,
      });


      // ------------------------------------------------------
      // SHOW BACKEND RESPONSE
      // IMPORTANT:
      // Backend sometimes returns next_question
      // and when ready returns next_action
      // ------------------------------------------------------

      const assistantMessage =
        data.next_question ||
        data.next_action ||
        null;


      if (assistantMessage) {

        setHistory((previous) => [
          ...previous,
          {
            role: "assistant",
            content: assistantMessage,
          },
        ]);

      }


    } catch (err) {

      console.error(err);


      setError(
        "Saarthi server se connect nahi ho pa raha. Please check karein ki backend running hai."
      );


      setHistory((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Maaf kijiye, abhi Saarthi server se connection nahi ho pa raha. Kripya backend check karke dobara try karein.",
        },
      ]);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // SUBMIT GRIEVANCE
  // ==========================================================

  const submit = async () => {

    if (
      !sessionId ||
      loading ||
      !ready
    ) {
      return;
    }


    setLoading(true);
    setError("");


    try {

      const response = await fetch(
        `${API_URL}/api/saarthi/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            session_id: sessionId,
          }),
        }
      );


      if (!response.ok) {

        const errorData =
          await response.json()
            .catch(() => null);

        throw new Error(
          errorData?.detail ||
          "Unable to submit grievance"
        );
      }


      const data =
        await response.json();


      // ------------------------------------------------------
      // SAVE TRACKING ID
      // ------------------------------------------------------

      setRegistration(
        data.grievance_id
      );


      // ------------------------------------------------------
      // UPDATE AUTHORITY
      // ------------------------------------------------------

      if (data.concerned_authority) {

        setAuthority(
          data.concerned_authority
        );

      }


      // ------------------------------------------------------
      // SHOW SUCCESS MESSAGE
      // ------------------------------------------------------

      const successMessage =
        data.message ||
        data.status_message ||
        `Aapki grievance successfully submit ho gayi hai. Aapka Tracking ID hai: ${data.grievance_id}`;


      setHistory((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            `${successMessage}\n\nTracking ID: ${data.grievance_id}`,
        },
      ]);


    } catch (err) {

      console.error(err);


      setError(
        "Grievance submit nahi ho paayi. Kripya dobara try karein."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <section className="file-layout">


      {/* ====================================================
          LEFT SIDE — CHAT
      ==================================================== */}

      <div className="chat-panel">


        {/* HEADER */}

        <div>

          <p className="eyebrow">
            Saarthi AI · Citizen Grievance Assistant
          </p>


          <h1 className="chat-heading">
            What needs fixing?
          </h1>


          <p className="chat-intro">
            Describe your problem in Hindi, English, or Hinglish.
            Saarthi will ask you for the required information
            step by step.
          </p>

        </div>


        {/* ==================================================
            CHAT MESSAGES
        ================================================== */}

        <div
          className="messages"
          aria-live="polite"
        >

          {history.map(
            (turn, index) => (

              <div
                className={`bubble ${turn.role}`}
                key={index}
              >
                {turn.content}
              </div>

            )
          )}


          {loading && (

            <div className="bubble assistant">
              Saarthi is thinking...
            </div>

          )}

        </div>


        {/* ==================================================
            CHAT INPUT
        ================================================== */}

        <form
          className="message-form"
          onSubmit={send}
        >

          <input
            value={text}

            onChange={(event) =>
              setText(event.target.value)
            }

            placeholder="Example: Mere yahan 5 din se kachra collect nahi hua"

            aria-label="Describe your grievance"

            disabled={
              loading ||
              Boolean(registration)
            }
          />


          <button
            className="button"
            type="submit"

            disabled={
              loading ||
              !text.trim() ||
              Boolean(registration)
            }
          >

            {loading
              ? "Please wait..."
              : "Continue"}

          </button>

        </form>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <p
            style={{
              marginTop: "10px",
            }}
          >
            {error}
          </p>

        )}


      </div>


      {/* ====================================================
          RIGHT SIDE — CASE FILE
      ==================================================== */}

      <aside className="draft-panel">


        {/* HEADER */}

        <div className="draft-header">

          <div>

            <p className="eyebrow">
              Your case file · not sent yet
            </p>


            <h2 className="draft-title">
              Check before you submit.
            </h2>

          </div>


          <HealthScoreSeal
            captured={health}
          />

        </div>


        {/* ==================================================
            READINESS SCORE
        ================================================== */}

        <p
          style={{
            marginBottom: "15px",
          }}
        >

          Complaint readiness:{" "}

          <strong>
            {readinessScore}%
          </strong>

        </p>


        {/* ==================================================
            CASE DETAILS
        ================================================== */}

        <dl className="draft-fields">


          {[
            [
              "Problem",
              draft.summary,
            ],

            [
              "Concerned authority",
              authority ||
              draft.department,
            ],

            [
              "Where it happened",
              draft.location,
            ],

            [
              "How long",
              draft.dateOrTimeframe,
            ],

            [
              "Draft grievance",
              draft.fullText,
            ],

          ].map(
            ([label, value]) => (

              <div
                className="draft-field"
                key={label as string}
              >

                <dt>
                  {label}
                </dt>


                <dd
                  className={
                    value
                      ? ""
                      : "empty"
                  }
                >

                  {value ||
                    "Saarthi will collect this information."}

                </dd>

              </div>

            )
          )}


        </dl>


        {/* ==================================================
            SUBMISSION SUCCESS
        ================================================== */}

        {registration ? (

          <div className="confirmation">

            <strong>
              Grievance submitted successfully
            </strong>


            <p>
              Aapki complaint successfully submit ho gayi hai.
              Is Tracking ID ko save kar lijiye.
            </p>


            <p className="mono">
              {registration}
            </p>


            <p className="confirmation-note">
              This is a demo record created by the Saarthi
              prototype. It has not been submitted to a real
              government grievance system.
            </p>

          </div>

        ) : (

          /* ================================================
              SUBMIT BUTTON
          ================================================ */

          <div className="submit-area">


            <button
              className="button ready"

              type="button"

              disabled={
                !ready ||
                loading
              }

              onClick={submit}
            >

              {loading
                ? "Please wait..."
                : "Submit grievance"}

            </button>


            <p className="submit-hint">

              {ready
                ? "Your grievance is ready for submission."
                : "Saarthi will enable submission when your complaint is ready."}

            </p>


          </div>

        )}


      </aside>


    </section>

  );

}