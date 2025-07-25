/**
 * Classifies the query as 'simple' or 'complex'.
 * @param {string} queryText - The text of the customer's query.
 * @returns {Promise<'simple' | 'complex'>}
 */
export async function classifyQuery(queryText: string): Promise<'simple' | 'complex'> {
  const complexKeywords = ['fail', 'crash', 'error', 'bug', 'technical', 'issue', 'locked'];
  const isComplex = complexKeywords.some(keyword => queryText.toLowerCase().includes(keyword));
  return isComplex ? 'complex' : 'simple';
}
