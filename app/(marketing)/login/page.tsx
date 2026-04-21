import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Log In — Crispy Development",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
