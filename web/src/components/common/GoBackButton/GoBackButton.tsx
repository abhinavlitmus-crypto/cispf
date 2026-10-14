"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/common/Button/Button";

export default function GoBackButton({ className }: { className?: string }) {
  const router = useRouter();

  // A visitor who opened the link directly has no page to go back to.
  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return <Button variant="outline" onClick={goBack} className={className}>GO BACK</Button>;
}
