"use client";
import { useAuth } from "@/hooks/auth";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import Typography from "../global/typography";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Nebula from "../../../public/nebula.png";
import Loader from "../global/loader";
const SignUpForm = () => {
  const { form2, handleSignUp, loading,socialAuth } = useAuth();
  return (
    <Form {...form2}>
      <form
        onSubmit={handleSignUp}
        className=" md:w-[50vw] sm:justify-center sm-w-[400px] space-y-6 flex flex-col p-10"
      >
        <Link href={"/"} className="w-full flex justify-left items-center">
          <Image src={Nebula} alt="Nebula-nexus" width={70} height={70} />
          <Typography
            variant="h2"
            text="Nebula Nexus."
            className="text-white ml-2 text-center"
          />
        </Link>
        <FormField
          disabled={loading}
          name="email"
          control={form2.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={loading}
          name="password"
          control={form2.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={loading}
          name="confirmPassword"
          control={form2.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          size="lg"
          disabled={loading}
          className="flex items-center justify-center bg-white border-[1px] border-black gap-x-2 dark:text-black font-semibold "
          onClick={()=>socialAuth("google")}
        >
          <FcGoogle size={25} />
          Go with Google
        </Button>
        <Button type="submit" size="lg" disabled={loading}>
          {!loading ? "Create Account" : <Loader />}
        </Button>
        <span className="flex items-center justify-center gap-x-3">
          <Typography variant="p" text="Already have an account?" />
          <Link href={"/sign-in"} className="hover:underline text-primary">
            Sign-in
          </Link>
        </span>

        <Typography
          text="✨ We're sending you a special link to the email address you provided. Just click on the link to verify your email and get started! ✨"
          variant="p"
          className="text-sm text-center"
        />
      </form>
    </Form>
  );
};

export default SignUpForm;
