"use client";

import { useEffect } from "react";
import clarity from "@microsoft/clarity";

export default function MicrosoftClarity({
  clarityProjectId,
}: {
  clarityProjectId: string;
}) {
  useEffect(() => {
    if (clarityProjectId && typeof window !== "undefined") {
      clarity.init(clarityProjectId);
    }
  }, [clarityProjectId]);

  return null;
}
