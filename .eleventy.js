const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("data");
  eleventyConfig.addPassthroughCopy("src/assets/css/style.css");

  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addCollection("projects", function(collection) {
    return collection.getFilteredByTag("projects").sort((a, b) => {
      if (a.data.date < b.data.date) {
        return 1;
      } else {
        return -1;
      }
    });
  })

  return {
    dir: {
      input: "src",
      includes: "_includes",
    }
  };
}
