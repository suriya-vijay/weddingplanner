import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up · Kalyanam & Co.",
  description:
    "Create your Kalyanam & Co. account — for couples and wedding vendors.",
};

export default function SignupPage() {
  return (
    <AuthShell
      panelTitle="Where forever takes shape."
      panelText="Join couples and the finest wedding vendors on one elegant platform — inspiration, planning tools, and a dedicated planner for every celebration."
      panelQuote={{
        quote:
          "Every vendor we booked came from a wedding we'd admired. Just taste, beautifully organised.",
        name: "Vikram, married in Mumbai",
      }}
    >
      <SignupForm />
    </AuthShell>
  );
}
