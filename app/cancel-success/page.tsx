import { Suspense } from "react";
import CancelSuccessClient from "./CancelSuccessClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelSuccessClient />
    </Suspense>
  );
}
