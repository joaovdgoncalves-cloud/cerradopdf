/**
 * Type safety declarations to prevent file.name/UUID confusion
 */

import { FileId, CerradoPDFFile } from "@app/types/fileContext";

declare global {
  namespace FileIdSafety {
    // Mark functions that should never accept file.name as parameters
    type SafeFileIdFunction<T extends (...args: never[]) => unknown> =
      T extends (...args: infer P) => infer _R
        ? P extends readonly [string, ...unknown[]]
          ? never // Reject string parameters in first position for FileId functions
          : T
        : T;

    // Mark functions that should only accept CerradoPDFFile, not regular File
    type CerradoPDFFileOnlyFunction<T extends (...args: never[]) => unknown> =
      T extends (...args: infer P) => infer _R
        ? P extends readonly [File, ...unknown[]]
          ? never // Reject File parameters in first position for CerradoPDFFile functions
          : T
        : T;

    // Utility type to enforce CerradoPDFFile usage
    type RequireCerradoPDFFile<T> = T extends File ? CerradoPDFFile : T;
  }

  // Extend Window interface for debugging
  interface Window {
    __FILE_ID_DEBUG?: boolean;
  }
}

// Augment FileContext types to prevent bypassing CerradoPDFFile
declare module "../contexts/FileContext" {
  export interface StrictFileContextActions {
    pinFile: (file: CerradoPDFFile) => void; // Must be CerradoPDFFile
    unpinFile: (file: CerradoPDFFile) => void; // Must be CerradoPDFFile
    addFiles: (
      files: File[],
      options?: { insertAfterPageId?: string },
    ) => Promise<CerradoPDFFile[]>; // Returns CerradoPDFFile
    consumeFiles: (
      inputFileIds: FileId[],
      outputFiles: File[],
    ) => Promise<CerradoPDFFile[]>; // Returns CerradoPDFFile
  }

  export interface StrictFileContextSelectors {
    getFile: (id: FileId) => CerradoPDFFile | undefined; // Returns CerradoPDFFile
    getFiles: (ids?: FileId[]) => CerradoPDFFile[]; // Returns CerradoPDFFile[]
    isFilePinned: (file: CerradoPDFFile) => boolean; // Must be CerradoPDFFile
  }
}

export {};
