const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Output directory: _site

  // Copy `img/` to `_site/img`
  eleventyConfig.addPassthroughCopy("public");

  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addCollection("projects", function(collection) {
    return collection.getFilteredByTag("projects");
  })
  return {
    dir: {
      input: "src",
      includes: "_includes",
    }
  };
}
