"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

const MOCK_OTP = "123456";

export default function LoginPage() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] =
    useState<"mobile" | "otp">("mobile");

  const [error, setError] = useState("");

  useEffect(() => {
    const existingUser =
      localStorage.getItem("saarthi_user");

    const existingMobile =
      localStorage.getItem("saarthi_mobile");

    if (existingUser || existingMobile) {
      router.replace("/");
    }
  }, [router]);

  const sendOtp = (
    event: FormEvent
  ) => {
    event.preventDefault();

    const cleanMobile =
      mobile.replace(/\D/g, "");

    if (cleanMobile.length !== 10) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    setMobile(cleanMobile);
    setError("");
    setStep("otp");
  };

  const verifyOtp = (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (otp !== MOCK_OTP) {
      setError(
        "Invalid OTP. For this demo, use 123456."
      );

      return;
    }

    const cleanMobile =
      mobile.replace(/\D/g, "");

    const user = {
      mobile: cleanMobile,
      name: `Citizen ${cleanMobile.slice(-4)}`,
      loggedIn: true,
    };

    // IMPORTANT:
    // Save both keys because SiteHeader
    // uses saarthi_mobile and saarthi_user.
    localStorage.setItem(
      "saarthi_mobile",
      cleanMobile
    );

    localStorage.setItem(
      "saarthi_user",
      JSON.stringify(user)
    );

    // Tell SiteHeader immediately
    // that authentication changed.
    window.dispatchEvent(
      new Event("saarthi-auth-change")
    );

    router.push("/");
    router.refresh();
  };

  return (
    <section className="page auth-page">

      <div className="auth-card">

        <p className="eyebrow">
          Welcome to Saarthi
        </p>

        <h1 className="page-title">
          {step === "mobile"
            ? "Sign in with your mobile number."
            : "Verify your mobile number."}
        </h1>

        <p className="subhead">
          {step === "mobile"
            ? "Enter your mobile number to register or log in to Saarthi."
            : `We sent a mock OTP to ${mobile}.`}
        </p>

        {step === "mobile" ? (

          <form onSubmit={sendOtp}>

            <label htmlFor="mobile">
              Mobile number
            </label>

            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              value={mobile}
              onChange={(event) => {
                setMobile(
                  event.target.value.replace(
                    /\D/g,
                    ""
                  )
                );

                setError("");
              }}
              placeholder="9876543210"
              maxLength={10}
              autoComplete="tel"
            />

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="button auth-button"
            >
              Continue
            </button>

          </form>

        ) : (

          <form onSubmit={verifyOtp}>

            <label htmlFor="otp">
              Enter OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(event) => {
                setOtp(
                  event.target.value.replace(
                    /\D/g,
                    ""
                  )
                );

                setError("");
              }}
              placeholder="123456"
              maxLength={6}
              autoComplete="one-time-code"
            />

            <p className="demo-otp">
              Demo OTP:{" "}
              <strong>
                123456
              </strong>
            </p>

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="button auth-button"
            >
              Verify and continue
            </button>

            <button
              type="button"
              className="text-button"
              onClick={() => {
                setStep("mobile");
                setOtp("");
                setError("");
              }}
            >
              Change mobile number
            </button>

          </form>

        )}

        <p className="auth-note">
          Prototype authentication for demonstration.
          No real OTP is sent.
        </p>

      </div>

    </section>
  );
}