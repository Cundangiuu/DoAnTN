"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

type Props = {
  redirect?: string;
};

export default function LoginButton(props: Readonly<Props>) {
  return (
    <button
      onClick={() => {
        signIn("google", { redirectTo: props.redirect ?? "/" });
      }}
      className="flex justify-center items-center px-6 py-2 bg-white gap-3 my-6 rounded-md shadow-md hover:shadow-sm"
    >
      <FcGoogle size={30} /> <p>Login with Google</p>
    </button>
  );
}