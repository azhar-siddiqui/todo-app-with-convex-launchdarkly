"use client";

import { LDProvider } from "launchdarkly-react-client-sdk";

export default function LaunchDarklyProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LDProvider clientSideID={process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID!}>
      {children}
    </LDProvider>
  );
}
