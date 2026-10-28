import type { CerradoPDFFileStub } from "@app/types/fileContext";
import type { PolicyState } from "@app/types/policies";
import { toolIOFor } from "@app/types/toolIO";
import { toolAcceptsFile } from "@app/utils/toolIOCompat";

/** Automatic enforcement requires a known first step that accepts the current file. */
export function policyAcceptsFile(
  policy: Pick<PolicyState, "firstOperation"> | undefined,
  file: Pick<CerradoPDFFileStub, "name" | "type" | "processedFile">,
): boolean {
  const operation = policy?.firstOperation;
  return Boolean(
    operation && toolIOFor(operation) && toolAcceptsFile(operation, file),
  );
}
