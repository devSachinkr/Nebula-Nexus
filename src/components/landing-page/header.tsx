"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Nebula from "../../../public/nebula.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
type Props = {};

const Header = (props: Props) => {
  return (
    <header className="p-4 flex justify-center items-center">
      <Link href="/" className="w-full flex justify-start items-center">
        <Image src={Nebula} alt="logo" width={35} height={35} />
        <span className="ml-2 text-white">Nebula Nexus.</span>
      </Link>
      <aside className="flex w-full gap-2 justify-end">
        <Link href={"/sign-in"}>
          <Button variant={"btn-secondary"} className="p-1 ">
            Login
          </Button>
        </Link>
        <Link href={"/sign-up"}>
          <Button variant={"btn-primary"} className="whitespace-nowrap">
            Sign up
          </Button>
        </Link>
      </aside>
    </header>
  );
};

export default Header;
