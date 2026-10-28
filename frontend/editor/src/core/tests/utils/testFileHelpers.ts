/**
 * Test utilities for creating CerradoPDFFile objects in tests
 */

import { CerradoPDFFile, createCerradoPDFFile } from "@app/types/fileContext";

/**
 * Create a CerradoPDFFile object for testing purposes
 */
export function createTestCerradoPDFFile(
  name: string,
  content: string = "test content",
  type: string = "application/pdf",
): CerradoPDFFile {
  const file = new File([content], name, { type });
  return createCerradoPDFFile(file);
}

/**
 * Create multiple CerradoPDFFile objects for testing
 */
export function createTestFilesWithId(
  files: Array<{ name: string; content?: string; type?: string }>,
): CerradoPDFFile[] {
  return files.map(
    ({ name, content = "test content", type = "application/pdf" }) =>
      createTestCerradoPDFFile(name, content, type),
  );
}
