/* grab strava data and create graph from strava data */

// Set the scales for the x and y axes
 const w_xScale = d3.scaleTime().range([0, 500]);
//const w_xScale = d3.scaleBand().range([0, 500]).padding(0.05)
const w_yScale = d3.scaleLinear().range([400, 0]);
const w_yScale2 = d3.scaleLinear().range([400, 0]);

// Create the line generator
// const w_line = d3.line()
//  .x(d => w_xScale(d.date))
//  .y(d => w_yScale(d.time));

let w_svg = d3.select('#strava-graph')
  .append('svg')
  .attr('width', 600)
  .attr('height', 500);

const w_line = d3.line()
  .x(d => w_xScale(d.date))
  .y(d => w_yScale2(d.distance));


// Create the SVG element
var w_g = w_svg.append("g")
    .attr("transform", "translate(50,50)");

d3.csv('/data/strava.csv').then((data) => { 
  data = data.filter(d => stravaParseTime(d.date) >= parseTime('2023-1-1'));
  data.forEach((d) => {
    d.date = stravaParseTime(d.date);
    d.time = parseFloat(d.time)/60;
    d.distance = parseFloat(d.distance)/1000;
  });

    //w_xScale.domain(d3.timeWeeks(parseTime('2023-1-1'), parseTime('2023-12-31')).map(d => d3.timeFormat('%U')(d)));
    w_xScale.domain([parseTime('2023-1-1'), parseTime('2023-12-31')]);
    w_yScale.domain([0, d3.max(data, d => d.time)]);
    w_yScale2.domain([0, d3.max(data, d => d.distance)]);


    // Add the x axis
    w_g.append('g')
      .attr('transform', 'translate(0, 400)')
      .call(d3.axisBottom(w_xScale).ticks(12)
   .tickFormat(d3.timeFormat('%b'))
      )
  .selectAll('text')
  .style('text-anchor', 'end')
  .attr('dx', '-0.4rem')
  .attr('dy', '0.3rem')
  .attr('transform', 'rotate(-45)');

    // Add the y axis
    w_g.append('g')
      .call(d3.axisLeft(w_yScale).tickFormat(function (d) {
      return d;
    }).ticks(13))
    .append("text")
    .attr("y", 6)
    .attr("dy", "1rem")
    .attr("text-anchor", "end")
    .text("value")

  // Add right y axis
    w_g.append('g')
      .call(d3.axisRight(w_yScale2).tickFormat(function (d) {
      return d;
    }).ticks(13))
  .attr('transform', 'translate(500,0)')
    .append("text")
    .attr("y", 6)
    .attr("dy", "1rem")
    .attr("text-anchor", "end")
    .text("value")


    //add axis labels
  w_svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 600 / 2)
    .attr("y", 490)
    .text("Month");

  w_svg.append("text")
    .attr("text-anchor", "end")
    .attr('fill', 'orange')
    .attr("y", 0)
    .attr("x", -250)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Time (m)");

  w_svg.append("text")
    .attr("text-anchor", "end")
    .attr("y", -600)
    .attr("x", 300)
  .attr("fill", "darkred")
    .attr("dy", ".75em")
    .attr("transform", "rotate(90)")
    .text("Distance (km)");

  //add bars
  w_g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("fill", "orange")
    .attr("x", barData => w_xScale(barData.date))
    .attr("y", barData => w_yScale(barData.time))
    .attr("width", 4)
    .attr("height", barData => 400 - w_yScale(barData.time))
  w_g.selectAll(".bar").data(data).enter()
  .append('rect')
    .attr("fill", "darkred")
    .attr("x", barData => w_xScale(barData.date) + 4)
    .attr("y", barData => w_yScale2(barData.distance))
    .attr("width", 4)
    .attr("height", barData => 400 - w_yScale2(barData.distance))

//    w_g.append('path')
//      .datum(data)
//      .attr('fill', 'none')
//      .attr('stroke', 'darkred')
//      .attr('stroke-width', 2)
//      .attr('d', w_line);

  })
  .catch(error => {
    console.error(error);
  });


  //add title
  w_svg.append("text")
    .attr("x", (600 / 2))
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Strava Activity");
