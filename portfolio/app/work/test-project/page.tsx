import type { Metadata } from "next";
import TestProjectCaseStudy from "@/components/TestProjectCaseStudy";

export const metadata: Metadata = {
  title: "Aegis Relay — Project Page Prototype | Pedro Martins",
  description:
    "An isolated fictional prototype for Pedro Martins' interactive technical case-study system.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestProjectPage() {
  return <TestProjectCaseStudy />;
}

