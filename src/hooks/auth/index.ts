"use client";

import { SignInSchema, SignUpSchema } from "@/types/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { googleLogin, loginUser, signUpUser } from "@/actions/auth";
import ToastNotify from "@/components/global/ToastNotify";
import { useRouter } from "next/navigation";
import { Provider } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/supabase-client";
export const useAuth = () => {
  // login
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //  sign-up
  const form2 = useForm<z.infer<typeof SignUpSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      confirmPassword: "",
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const submit = form.handleSubmit(
    async ({ email, password }: z.infer<typeof SignInSchema>) => {
      setLoading(true);
      const res = await loginUser(email, password);
      const { data, error } = JSON.parse(res);
      if (error) {
        form.reset();
        setLoading(false);
      }
      ToastNotify({
        title: "Success",
        msg: "Login successfully",
      });
      setLoading(false);
      router.push("/dashboard");
    }
  );

  const handleSignUp = form2.handleSubmit(
    async ({ email, password }: z.infer<typeof SignUpSchema>) => {
      setLoading(true);
      const res = await signUpUser(email, password);
      const { data, error } = JSON.parse(res);
      if (error) {
        form2.reset();
        setLoading(false);
      }
      ToastNotify({
        title: "Success",
        msg: "Email sent!  check your email  inbox or spam",
      });
      setLoading(false);
      router.push("/dashboard");
    }
  );

  const socialAuth = async (provider: Provider) => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      setLoading(false);
      console.log(error);
      return;
    }

    setLoading(false);
  };
  return {
    form,
    submit,
    loading,
    form2,
    handleSignUp,
    socialAuth,
  };
};
