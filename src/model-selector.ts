/**
 * Selects the appropriate AI model based on query complexity.
 * @param {'simple' | 'complex'} complexity - The complexity of the query.
 * @returns {string} The model to use.
 */
export function selectModel(complexity: 'simple' | 'complex'): string {
  if (complexity === 'simple') {
    return 'gemini-1.5-flash'; // Or 'mistral-small'
  } else {
    return 'gemini-pro'; // Or 'gpt-4o', 'claude-3-opus'
  }
}
