import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log In · Kalyanam & Co.",
  description: "Sign in to your Kalyanam & Co. wedding workspace.",
};

export default function LoginPage() {
  return (
    <AuthShell
      panelTitle="Your forever, beautifully planned."
      panelText="Sign in to your private wedding workspace — inspiration, vendors, planning tools, and your dedicated planner, all in one elegant place."
      panelQuote={{
        quote:
          "It felt like having a luxury planner in our pocket — and a real one on the day.",
        name: "Aanya, married in Udaipur",
      }}
    >
      <LoginForm />
    </AuthShell>
  );
}
