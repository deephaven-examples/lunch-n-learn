/**
 * Remove all e's and r's from a string, regardless of case.
 * If I give you 'tree', you give me 't'. If I gave you 'Eerie', you give me 'i'.
 * If I give you 'something', you give me 'somthing'.
 * @param str The string to remove e's and r's from
 * @returns The string without e's and r's
 */
export function removeEr(str: string): string {
  return str.replace(/[er]/gi, "");
}

/**
 * Tests for the removeEr function
 */
