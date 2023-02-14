const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("data");
  eleventyConfig.addPassthroughCopy("scripts");
  eleventyConfig.addPassthroughCopy("src/assets/css/style.css");

  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addCollection("projects", function(collection) {
    return collection.getFilteredByTag("projects");
  })

  eleventyConfig.addCollection("goals", function(collection) {
    return collection.getFilteredByTag("goals");
  })

  return {
    dir: {
      input: "src",
      includes: "_includes",
    }
  };
}
