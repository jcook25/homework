//start with defining svg dimensions
var svgWidth = 960;
var svgHeight = 500;

var axisDelay = 1500;
var circleDely = 1500;

//set the margin
var margin = { top: 20, right: 40, bottom: 80, left: 100 };

//calculate chart Dimension by adjusting the margin
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("hairData.csv", rowConverter)
  .then(createChart)
  .catch(function (error) {
    console.log("*********unexpected error occured*********")
    console.log(error);
  });

/******************************************** */
function rowConverter(row) {
  row.hair_length = + row.hair_length;
  row.num_hits = + row.num_hits;
  row.num_albums = +row.num_albums;
  return row;
}
/********************************************/

function createChart(hairData) {

  //we store the current chartinformation into activeInfo Object
  var activeInfo = {
    data: hairData,
    currentX: "hair_length",
    currentY: "num_hits",
  };

  /*********************************************/

  activeInfo.xScale = d3.scaleLinear()
    .domain(getXDomain(activeInfo))
    .range([0, chartWidth]);

  activeInfo.yScale = d3.scaleLinear()
    .domain(getYDomain(activeInfo))
    .range([chartHeight, 0])

  activeInfo.xAxis = d3.axisBottom(activeInfo.xScale);
  activeInfo.yAxis = d3.axisLeft(activeInfo.yScale);

  createAxis(activeInfo);


  /*********************************************/

  createCircles(activeInfo);

  createToolTip(activeInfo);

  createLables()

  d3.selectAll(".aText").on("click", function () {
    handleClick(d3.select(this), activeInfo)
  })

}
/********************************************/

function handleClick(label, activeInfo) {

  var axis = label.attr("data-axis")
  var name = label.attr("data-name");

  if (label.classed("active")) {
    //no need to do anything if clicked on active axis
    return;
  }
  updateLabel(label, axis)

  if (axis === "x") {
    activeInfo.currentX = name;
    activeInfo.xScale.domain(getXDomain(activeInfo))
    renderXAxes(activeInfo)
    renderHorizontal(activeInfo)
  }
  else //add logic to handle y axis click
  {
    activeInfo.currentY = name;
    activeInfo.yScale.domain(getYDomain(activeInfo))
    renderYAxes(activeInfo)
    renderVertical(activeInfo)
  }
}

/********************************************/
/*************ADDING LABLES******************/
function createLables() {

  var xlabelsGroup = chartGroup.append("g")
    .attr("class", "xText")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("data-name", "hair_length")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("Hair Metal Ban Hair Length (inches)");

  xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("data-name", "num_albums")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("# of Albums Released");

  var ylabelsGroup = chartGroup.append("g")
    .attr("class", "yText")
    .attr("transform", " rotate(-90)")

  ylabelsGroup.append("text")
    .attr("y", -60)
    .attr("x", -chartHeight / 2)
    .attr("dy", "1em")
    .attr("data-name", "num_hits")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Number of Billboard 500 Hits");

}
/********************************************/
function createCircles(activeInfo) {

  var currentX = activeInfo.currentX
  var currentY = activeInfo.currentY
  var xScale = activeInfo.xScale
  var yScale = activeInfo.yScale

  chartGroup.selectAll("circle")
    .data(activeInfo.data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d[currentX]))
    .attr("cy", d => yScale(d[currentY]))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");
}
/********************************************/

function createAxis(activeInfo) {

  chartGroup.append("g")
    .call(activeInfo.yAxis)
    .attr("class", "y-axis")


  chartGroup.append("g")
    .call(activeInfo.xAxis)
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${chartHeight})`)
}


/********************************************/
function renderXAxes(activeInfo) {
  chartGroup.select(".x-axis").transition()
    .duration(axisDelay)
    .call(activeInfo.xAxis);
}
/********************************************/
function renderYAxes() {
  chartGroup.select(".y-axis").transition()
    .duration(axisDelay)
    .call(activeInfo.yAxis);
}

/********************************************/
function getXDomain(activeInfo) {
  var min = d3.min(activeInfo.data, d => d[activeInfo.currentX])
  var max = d3.max(activeInfo.data, d => d[activeInfo.currentX])
  return [min * 0.8, max * 1.2]
}
/********************************************/
function getYDomain(activeInfo) {
  var min = 0 //d3.min(activeInfo.data, d => d[activeInfo.currentY])
  var max = d3.max(activeInfo.data, d => d[activeInfo.currentY])
  return [min, max]
}
/********************************************/

function renderHorizontal(activeInfo) {

  d3.selectAll("circle")
    .each(adjustCircles) 

  function adjustCircles(){
    d3.select(this)
      .transition()
      .attr("cx", d => activeInfo.xScale(d[activeInfo.currentX]))
      .duration(circleDely)
  }
}

/********************************************/
function renderVertical(activeInfo) {
  d3.selectAll("circle")
    .each(function () {
      d3.select(this)
        .transition()
        .attr("cy", d => activeInfo.yScale(d[activeInfo.currentY]))
        .duration(circleDely)
    })
}

/********************************************/

function updateLabel(label, axis) {

  d3.selectAll(".aText")
    .filter("." + axis)
    .filter(".active")
    .classed("active", false)
    .classed("inactive", true);

  label.classed("inactive", false).classed("active", true)
}

/********************************************/

function createToolTip(activeInfo) {
  var label;

  if (activeInfo.currentX === "hair_length") {
    label = "Hair Length:";
  }
  else {
    label = "# of Albums:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      var html = d.rockband
        + "<br> " + label
        + d[activeInfo.currentX]
        + "<br> Number of Hits: "
        + d[activeInfo.currentY]
      return html;
    });

  chartGroup.call(toolTip);

  var circles = d3.selectAll("circle");

  circles.on("mouseover", function (data) {
    toolTip.show(data);
  })

  circles.on("mouseout", function (data, index) {
    toolTip.hide(data);
  });
}

/********************************************/
