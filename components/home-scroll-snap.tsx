
"use client";

import { useEffect, type ReactNode } from "react";

type HomeScrollSnapProps = {
  children: ReactNode;
};

export default function HomeScrollSnap({
  children,
}: HomeScrollSnapProps) {
  useEffect(() => {
    const root = document.documentElement;

    root.classList.add("eventora-snap-active");

    return () => {
      root.classList.remove("eventora-snap-active");
    };
  }, []);

  return <div className="eventora-home">{children}</div>;
}
