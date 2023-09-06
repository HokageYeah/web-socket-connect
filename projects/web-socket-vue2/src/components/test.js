class Query {
  constructor(data) {
    this.data = data;
    this.filters = [];
    this.sorters = [];
    this.groupByField = null;
  }

  filter(predicate) {
    this.filters.push(predicate);
    return this;
  }

  sort(compareFn) {
    this.sorters.push(compareFn);
    return this;
  }

  groupBy(field) {
    this.groupByField = field;
    return this;
  }

  execute() {
    let result = [...this.data];

    // Apply filters
    for (const predicate of this.filters) {
      result = result.filter(predicate);
    }

    // Apply sorting
    for (const compareFn of this.sorters) {
      result.sort(compareFn);
    }

    // Apply grouping
    if (this.groupByField) {
      const groups = new Map();
      for (const item of result) {
        const key = item[this.groupByField];
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key).push(item);
      }
      result = Array.from(groups.values());
    }

    return result;
  }
}

export default Query;
