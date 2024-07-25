"use client ";
import { useAuth } from "@/hooks/auth";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Link from "next/link";
import Image from "next/image";
import Nebula from "../../../public/nebula.png";
import Typography from "../global/typography";
import { Button } from "../ui/button";
import Loader from "../global/loader";
const SignInForm = () => {
  const { form, submit, loading } = useAuth();
  return (
    <Form {...form}>
      <form
        onSubmit={submit}
        className="md:w-[500px] sm:w-[300px] sm:justify-center  space-y-6 flex flex-col p-10"
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
          control={form.control}
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
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" disabled={loading}>
          {!loading ? "Login" : <Loader />}
        </Button>
        <span className="flex items-center justify-center gap-x-3">
          <Typography variant="p" text="Don't have an account?" />
          <Link href={"/sign-up"} className="hover:underline text-primary">Sign-up</Link>
        </span>
      </form>
    </Form>
  );
};

export default SignInForm;
