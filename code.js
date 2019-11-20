// to launch a local web server on MAC terminal
// python3 -m http.server
$(document).ready(function() {
  // 1. Code here runs first, before the download starts.

d3.tsv("data.tsv", function(error, data) {
  // 3. Code here runs last, after the download finishes.
});

// 2. Code here runs second, while the file is downloading.
// 
	var data = [4, 8, 15, 16, 23, 42];
  // DIV
  var x = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, 420]);
  
  d3.select(".chart")
    .selectAll("div")
      .data(data)
    .enter().append("div")
      .style("width", function(d) { return x(d) + "px"; })
      .text(function(d) { return d; });	

  // SVG
  var width = 420,
      barHeight = 20;
  var xi = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, width]);
  var chart = d3.select(".chartSVG")
    .attr("width", width)
    .attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", xi)
      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", function(d) { return xi(d) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  // TSV
  var width = 420,
    barHeight = 20;

  var x = d3.scaleLinear()
      .range([0, width]);

  var chart = d3.select(".chartTSV")
      .attr("width", width);

  d3.tsv("data.tsv", function(tsv_item) {
    return {
      name: tsv_item.name,
      value: +tsv_item.value // convert column to number
    };
  }).then(function(tsv_data) {

    x.domain([0, d3.max(tsv_data, function(d) { return d.value; })]);

    chart.attr("height", barHeight * tsv_data.length);

    var bar = chart.selectAll("g")
        .data(tsv_data)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
        .attr("width", function(d) { return x(d.value); })
        .attr("height", barHeight - 1);

    bar.append("text")
        .attr("x", function(d) { return x(d.value) - 3; })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d.value; });
  });

  // Rotating into columns
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = 960,
      height = 500;
  var x_rot = d3.scaleBand()
    .rangeRound([0, width])
    .padding(.1);    
  var y_rot = d3.scaleLinear()
      .range([height, 0]);
  var xAxis = d3.axisBottom()
    .scale(x_rot);
  var yAxis = d3.axisLeft()
    .scale(y_rot);

  var chartROT = d3.select(".chartROT")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

  d3.tsv("data.tsv", function(data_item) {
    return {
      name: data_item.name,
      value: +data_item.value // convert column to number
    };
  }).then(function(data_array) {
    x_rot.domain(data_array.map(function(d) { return d.name; }));
    y_rot.domain([0, d3.max(data_array, function(d) { return d.value; })]);

    var bar = chartROT.selectAll("g")
        .data(data_array)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x_rot(d.name) + ",0)"; });

    /*
    bar.append("rect")
        .attr("y", function(d) { return y_rot(d.value); })
        .attr("height", function(d) { return height - y_rot(d.value); })
        .attr("width", x_rot.bandwidth());

    bar.append("text")
        .attr("x", x_rot.bandwidth() / 2)
        .attr("y", function(d) { return y_rot(d.value) + 3; })
        .attr("dy", ".75em")
        .text(function(d) { return d.value; });
    */

    chartROT.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chartROT.append("g")
      .attr("class", "y axis")
      .call(yAxis);    

    chart.selectAll(".bar")
      .data(data_array)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x_rot(d.name); })
      .attr("y", function(d) { return y_rot(d.value); })
      .attr("height", function(d) { return height - y_rot(d.value); })
      .attr("width", x_rot.bandwidth());
  });    
});