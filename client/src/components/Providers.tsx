// 'use client';

// import { SessionProvider } from "next-auth/react";

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <SessionProvider>
//       {children}
//     </SessionProvider>
//   );
// }



'use client';

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast"; // 1. Import this

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      {/* 2. Add Toaster here. This handles the UI for the popups */}
      <Toaster position="top-center" reverseOrder={false} />
    </SessionProvider>
  );
}