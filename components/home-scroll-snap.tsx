
"use client";

import { useEffect, type ReactNode } from "react";

type HomeScrollSnapProps = {
  children: ReactNode;
};

export default function HomeScrollSnap({
  children,
}: HomeScrollSnapProps) {
  useEffect(() => {
    document.documentElement.classList.add("eventora-snap-active");

    return () => {
      document.documentElement.classList.remove("eventora-snap-active");
    };
  }, []);

  return <div className="eventora-home">{children}</div>;
}
