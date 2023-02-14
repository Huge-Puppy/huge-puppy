/* grab strava data and create graph from strava data */

// Set the scales for the x and y axes
// const w_xScale = d3.scaleTime().range([DateTime(2007,4,23), Date(2012,6,1)]);
const w_xScale = d3.scaleTime().range([0, 500])
const w_yScale = d3.scaleLinear().range([400, 0]);

// Create the line generator
const w_line = d3.line()
  .x(d => w_xScale(d.date))
  .y(d => w_yScale(d.time));

let w_svg = d3.select('#strava-graph')
  .append('svg')
  .attr('width', 600)
  .attr('height', 500);


// Create the SVG element
var w_g = w_svg.append("g")
    .attr("transform", "translate(50,50)");

d3.csv('/data/strava.csv').then((data) => { 
  data = data.filter(d => stravaParseTime(d.date) > parseTime('2023-1-1'));
  data.forEach((d) => {
    d.date = stravaParseTime(d.date);
    d.time = parseFloat(d.time)/60;
    d.distance = parseFloat(d.distance)/1000;
  });
  data.unshift({date:data[0].date, time:0, distance:0});
    data.push({date: data[data.length-1].date, time:0, distance:0});

//    w_xScale.domain(d3.extent(data, d => d.date));
    w_xScale.domain([parseTime('2023-1-1'), parseTime('2023-12-31')]);
    w_yScale.domain([0, d3.max(data, d => d.time)]);


    // Add the x axis
    w_g.append('g')
      .attr('transform', 'translate(0, 400)')
      .call(d3.axisBottom(w_xScale).ticks(d3.timeMonth, 1)
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


    //add axis labels
  w_svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 600 / 2)
    .attr("y", 490)
    .text("Month");

  w_svg.append("text")
    .attr("text-anchor", "end")
    .attr("y", 0)
    .attr("x", -250)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Time (m)");


    // Add the line chart
    w_g.append('path')
      .datum(data)
      .attr('fill', 'darkgreen')
      .attr('stroke', 'darkgreen')
      .attr('stroke-width', 4)
      .attr('d', w_line);
  })
  .catch(error => {
    console.error(error);
  });


  //add title
  w_svg.append("text")
    .attr("x", (600 / 2))
    .attr("y", 80)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Strava Activity");
