export const dynamicSearch = (search, boolean, numbers, string) => {
  let searchFields = [];

  if (search === "true" || search === "false") {
    searchFields = boolean;
  } else if (/\d/.test(search) && /[a-z]/.test(search) != true) {
    searchFields = numbers;
  } else if (typeof search === "string") {
    searchFields = string;
  }

  const dynamicSearchQueries = searchFields?.map((field) => {
    if (search === "true" || search === "false") {
      return {
        [field]: search,
      };
    } else if (/\d/.test(search) && /[a-z]/.test(search) != true) {
      return {
        // $expr: {
        //   $regexMatch: {
        //     input: { $toString: `$${field}` },
        //     regex: new RegExp(search.toString()),
        //     options: "i",
        //   },
        // },

        [field]: { $eq: parseInt(search, 10) }
      };
    } else if (typeof search === "string") {
      return {
        [field]: { $regex: search, $options: "i" },
      };
    }
  });

  const searchQuery =
    dynamicSearchQueries?.length > 0 ? { $or: dynamicSearchQueries } : [];

  return searchQuery;
};
