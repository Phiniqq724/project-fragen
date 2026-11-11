"use client";

import { useActionState } from "react";
import { Button, Field, Input, IconSignIn } from "@/components/ui";
import { useI18n } from "@/components/i18n/provider";
import { signIn, type SignInState } from "./actions";

const initial: SignInState = { error: null, email: "" };

export function LoginForm() {
  const { dict } = useI18n();
  const t = dict.admin.login;
  const [state, action, pending] = useActionState(signIn, initial);

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <Field id="email" label={t.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          defaultValue={state.email}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </Field>
      <Field id="password" label={t.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </Field>

      {state.error ? (
        <p id="login-error" role="alert" className="text-sm font-semibold text-danger">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" pending={pending} className="w-full" icon={<IconSignIn />}>
        {pending ? t.signingIn : t.signIn}
      </Button>
    </form>
  );
}
