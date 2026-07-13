"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi, type ForgotPasswordInput } from "../api/auth.api";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authApi.forgotPassword(input),
  });
}
