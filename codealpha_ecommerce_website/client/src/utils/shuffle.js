/**
 * Utility function to perform a Fisher-Yates shuffle on an array.
 * Creates a shallow copy of the array and randomizes element order.
 */
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Smart Interleaving Algorithm to maximize Homepage Category Diversity
 * Rotates round-robin through all available categories to avoid showing
 * repetitive items side-by-side.
 */
export const getInterleavedProducts = (products, limit = 20) => {
  if (!products || !products.length) return [];

  // Group by category
  const categoryMap = {};
  products.forEach((p) => {
    const cat = p.category || 'General';
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(p);
  });

  // Shuffle order of items within each category
  Object.keys(categoryMap).forEach((cat) => {
    categoryMap[cat] = shuffleArray(categoryMap[cat]);
  });

  const categories = shuffleArray(Object.keys(categoryMap));
  const result = [];
  const pointers = {};
  categories.forEach((cat) => (pointers[cat] = 0));

  let added = true;
  while (result.length < limit && added) {
    added = false;
    for (const cat of categories) {
      if (result.length >= limit) break;
      const idx = pointers[cat];
      if (idx < categoryMap[cat].length) {
        result.push(categoryMap[cat][idx]);
        pointers[cat]++;
        added = true;
      }
    }
  }

  return result;
};
