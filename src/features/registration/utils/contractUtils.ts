/**
 * Checks if a given student grade corresponds to the final year (Tercero de Bachillerato).
 *
 * @param grade - The student's grade string (e.g., "TERCERO DE BACHILLERATO A")
 * @returns boolean - True if the grade starts with "TERCERO DE BACHILLERATO" (case-insensitive)
 */
export function isFinalYearGrade(grade?: string): boolean {
  if (!grade) return false;
  return grade.trim().toUpperCase().startsWith("TERCERO DE BACHILLERATO");
}
