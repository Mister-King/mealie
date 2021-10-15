export const recipe = {
  /**
   * Sorts a list of recipes in place
   * @param {Array<Object>} list of recipes
   * @param {Boolean} inverse - Z or A First
   */
  sortAToZ(list) {
    list.sort((a, b) => {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  },
  sortByCreated(list) {
    list.sort((a, b) => (a.dateAdded > b.dateAdded ? -1 : 1));
  },
  sortByUpdated(list) {
    list.sort((a, b) => (a.dateUpdated > b.dateUpdated ? -1 : 1));
  },
  sortByRating(list) {
    list.sort((a, b) => (this.getAverageRating(JSON.parse(a.ratings)) > this.getAverageRating(JSON.parse(b.ratings)) ? -1 : 1));
  },
  /**
   *
   * @param {Array<Object>} list
   * @returns String / Recipe Slug
   */
  randomRecipe(list) {
    return list[Math.floor(Math.random() * list.length)];
  },
  shuffle(list) {
    let last = list.length;
    let n;
    while (last > 0) {
      n = rand(last);
      swap(list, n, --last);
    }
  },
  getAverageRating(ratings) {
    if (!ratings?.length > 0) {
      return 0;
    }

    const objAverage = ratings.reduce((prev, current) => {
      return { rating: prev.rating + current.rating }
    });

    return objAverage.rating / ratings.length;
  },
};

const rand = n =>
  Math.floor(Math.random() * n)

function swap(t, i, j) {
  let q = t[i];
  t[i] = t[j];
  t[j] = q;
  return t;
}
