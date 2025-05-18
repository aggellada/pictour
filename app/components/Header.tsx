"use client";

import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { Menu, Search } from "lucide-react";
import React, { useRef } from "react";

type Props = {
  searchLocation: (searchValue: string) => Promise<void>;
  handleExpandBurger: () => void;
};

function Header({ searchLocation, handleExpandBurger }: Props) {
  const { isAuthenticated, getUser } = useKindeBrowserClient();
  const user = getUser();

  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full h-[90px] border-b-2 border-gray-700 md:border-0 bg-gray-900 flex items-center justify-between px-4 md:p-0">
      <div className="hidden md:flex lg:w-1/5 md:w-2/5 h-full md:p-4  items-center justify-center border-b-1 border-r-1 border-gray-600">
        <h1 className=" md:text-xl lg:text-lg xl:text-5xl font-bold">
          Pictour
        </h1>
      </div>
      <Menu className="md:hidden" onClick={handleExpandBurger} />
      <div className="hidden md:flex w-full justify-between px-8">
        <div className="flex gap-4 items-center justify-center ">
          {user && user?.picture && (
            <img
              src={user.picture}
              className="rounded-full w-[50px] object-cover"
            />
          )}
          {user && <h1>Hi, {user.given_name}!</h1>}
        </div>
        <div className="flex gap-32 md:gap-12 items-center">
          <div className="flex gap-4">
            <input
              type="text"
              className="bg-white text-black w-11/12 rounded-sm"
              ref={searchRef}
              placeholder="Search the map"
            />
            <button
              onClick={() => searchLocation(searchRef.current?.value || "")}
            >
              <Search />
            </button>
          </div>
          {isAuthenticated && (
            <div className="">
              <LogoutLink>Logout</LogoutLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
