import {
  CerradoPDFFile,
  FileId,
  CerradoPDFFileStub,
  createCerradoPDFFile,
  ProcessedFileMetadata,
  createNewCerradoPDFFileStub,
} from "@app/types/fileContext";

/**
 * Builds parallel inputFileIds and inputCerradoPDFFileStubs arrays from the valid input files.
 * Falls back to a fresh stub when the file is not found in the current context state
 * (e.g. it was removed between operation start and this point).
 */
export function buildInputTracking(
  validFiles: CerradoPDFFile[],
  selectors: {
    getCerradoPDFFileStub: (id: FileId) => CerradoPDFFileStub | undefined;
  },
): { inputFileIds: FileId[]; inputCerradoPDFFileStubs: CerradoPDFFileStub[] } {
  const inputFileIds: FileId[] = [];
  const inputCerradoPDFFileStubs: CerradoPDFFileStub[] = [];
  for (const file of validFiles) {
    const fileId = file.fileId;
    const record = selectors.getCerradoPDFFileStub(fileId);
    if (record) {
      inputFileIds.push(fileId);
      inputCerradoPDFFileStubs.push(record);
    } else {
      console.debug(`No file stub found for file: ${file.name}`);
      inputFileIds.push(fileId);
      inputCerradoPDFFileStubs.push(createNewCerradoPDFFileStub(file, fileId));
    }
  }
  return { inputFileIds, inputCerradoPDFFileStubs };
}

/**
 * Creates parallel outputCerradoPDFFileStubs and outputCerradoPDFFiles arrays from processed files.
 * The stubFactory determines how each stub is constructed (child version vs fresh root).
 */
export function buildOutputPairs(
  processedFiles: File[],
  thumbnails: string[],
  metadataArray: Array<ProcessedFileMetadata | undefined>,
  stubFactory: (
    file: File,
    thumbnail: string,
    metadata: ProcessedFileMetadata | undefined,
    index: number,
  ) => CerradoPDFFileStub,
): {
  outputCerradoPDFFileStubs: CerradoPDFFileStub[];
  outputCerradoPDFFiles: CerradoPDFFile[];
} {
  const outputCerradoPDFFileStubs = processedFiles.map((file, index) =>
    stubFactory(file, thumbnails[index], metadataArray[index], index),
  );
  const outputCerradoPDFFiles = processedFiles.map((file, index) =>
    createCerradoPDFFile(file, outputCerradoPDFFileStubs[index].id),
  );
  return { outputCerradoPDFFileStubs, outputCerradoPDFFiles };
}
