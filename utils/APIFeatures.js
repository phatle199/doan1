class APIFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    let queryObj = { ...this.reqQuery };
    const excludes = ['sort', 'fields', 'page', 'size'];
    Object.keys(queryObj).forEach((el) => {
      if (excludes.includes(el)) delete queryObj[el];
    });

    // { duration: { gte: '5' } } => { duration: { '$gte': '5' } }
    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      let { sort: sortStr } = this.reqQuery;
      sortStr = sortStr.replace(/,/g, ' ');
      this.query = this.query.sort(sortStr);
    }

    return this;
  }

  limitFields() {
    if (this.reqQuery.fields) {
      let { fields } = this.reqQuery;
      fields = fields.replace(/,/g, ' ');
      this.query = this.query.select(fields);
    }

    return this;
  }

  paginate() {
    if (this.reqQuery.page) {
      let { page, size } = this.reqQuery;
      if (page < 1) page = 1;
      if (!size) size = 5;
      const skipValue = (page - 1) * size;
      this.query = this.query.skip(skipValue).limit(size);
    }

    return this;
  }
}

module.exports = APIFeatures;
