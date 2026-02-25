import { Suspense } from "react";
import UploadSuccessClient from "./UploadSuccessClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadSuccessClient />
    </Suspense>
  );
}
