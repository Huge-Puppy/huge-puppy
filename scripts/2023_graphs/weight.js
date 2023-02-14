/* grab strava data and create graph from strava data */

// Set the scales for the x and y axes
// const s_xScale = d3.scaleTime().range([DateTime(2007,4,23), Date(2012,6,1)]);
const s_xScale = d3.scaleTime().range([0, 500])
const s_yScale = d3.scaleLinear().range([400, 0]);

// Create the line generator
const s_line = d3.line()
  .x(d => s_xScale(d.date))
  .y(d => s_yScale(d.weight));

let s_svg = d3.select('#weight-graph')
  .append('svg')
  .attr('width', 600)
  .attr('height', 500);

  //add title
  s_svg.append("text")
    .attr("x", (600 / 2))
    .attr("y", 80)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Weight Lost in 2023");

// Create the SVG element
var s_g = s_svg.append("g")
    .attr("transform", "translate(50,50)");

d3.csv('/data/weight.csv').then((data) => { 
  data.forEach((d) => {
    d.date = parseTime(d.date);
    d.weight = parseFloat(d.weight);
  });

    s_xScale.domain([parseTime('2023-1-1'), parseTime('2023-12-31')]);
    s_yScale.domain([190, d3.max(data, d => d.weight)]);


    // Add the x axis
    s_g.append('g')
      .attr('transform', 'translate(0, 400)')
      .call(d3.axisBottom(s_xScale).ticks(d3.timeMonth, 1)
   .tickFormat(d3.timeFormat('%b'))
      )
  .selectAll('text')
  .style('text-anchor', 'end')
  .attr('dx', '-0.4rem')
  .attr('dy', '0.3rem')
  .attr('transform', 'rotate(-45)');

    // Add the y axis
    s_g.append('g')
      .call(d3.axisLeft(s_yScale).tickFormat(function (d) {
      return d;
    }).ticks(13))
    .append("text")
    .attr("y", 6)
    .attr("dy", "1rem")
    .attr("text-anchor", "end")
    .text("value")


    //add axis labels
  s_svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 600 / 2)
    .attr("y", 490)
    .text("Year");

  s_svg.append("text")
    .attr("text-anchor", "end")
    .attr("y", 0)
    .attr("x", -250)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Weight");

    // Add the line chart
    s_g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'darkgreen')
      .attr('stroke-width', 4)
      .attr('d', s_line);


  // add the goal weight
  s_g.append('line')
    .attr('class', 'dotted-line')
    .attr('x1', 0)
    .attr('x2', 500)
    .attr('y1', s_yScale(195))
    .attr('y2', s_yScale(195))



  })
  .catch(error => {
    console.error(error);
  });


