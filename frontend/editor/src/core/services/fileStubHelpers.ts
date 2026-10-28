import { CerradoPDFFile, CerradoPDFFileStub } from "@app/types/fileContext";
import {
  createChildStub,
  generateProcessedFileMetadata,
} from "@app/contexts/file/fileActions";
import { createCerradoPDFFile } from "@app/types/fileContext";
import { ToolId } from "@app/types/toolId";

/**
 * Create CerradoPDFFiles and CerradoPDFFileStubs from exported files
 * Used when saving page editor changes to create version history
 */
export async function createCerradoPDFFilesAndStubs(
  files: File[],
  parentStub: CerradoPDFFileStub,
  toolId: ToolId,
  /** Shown instead of the tool's name in version history (a policy passes its pipeline name). */
  label?: string,
): Promise<{ stirlingFiles: CerradoPDFFile[]; stubs: CerradoPDFFileStub[] }> {
  const stirlingFiles: CerradoPDFFile[] = [];
  const stubs: CerradoPDFFileStub[] = [];

  for (const file of files) {
    const processedFileMetadata = await generateProcessedFileMetadata(file);
    const childStub = createChildStub(
      parentStub,
      { toolId, timestamp: Date.now(), ...(label ? { label } : {}) },
      file,
      processedFileMetadata?.thumbnailUrl,
      processedFileMetadata,
    );

    const stirlingFile = createCerradoPDFFile(file, childStub.id);
    stirlingFiles.push(stirlingFile);
    stubs.push(childStub);
  }

  return { stirlingFiles, stubs };
}
