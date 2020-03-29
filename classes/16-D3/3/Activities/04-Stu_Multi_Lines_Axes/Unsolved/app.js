// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
    .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("data.csv", rowConverter)
    .then(createChart)
    .catch(function (error) {
        console.log(error);
    });

/**********************************************/
var parseTime = d3.timeParse("%d-%b-%Y");

function rowConverter(row) {
    row.dow_index = +row.dow_index;
    row.smurf_sightings = + row.smurf_sightings;
    row.date = parseTime(row.date)
    return row;
}
/**********************************************/
function createChart(smurfData) {
    console.table(smurfData, ["date", "dow_index", "smurf_sightings"])

    /*****************************************/
    // create x-axis scale
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(smurfData, d => d.date))
        .range([0, chartWidth]);

    //create Dow Scale
    var yDowScale = d3.scaleLinear()
        .domain([0, d3.max(smurfData, d => d.dow_index)])
        .range([chartHeight, 0]);

    //create Smurf Scale
    var ySmurfScale = d3.scaleLinear()
        .domain([0, d3.max(smurfData, d => d.smurf_sightings)])
        .range([chartHeight, 0]);


    /*****************************************/

    var bottomAxis = d3.axisBottom(xTimeScale)
        .tickFormat(d3.timeFormat("%d-%b-%Y"));

    var dowAxis = d3.axisLeft(yDowScale);
    var smurfAxis = d3.axisRight(ySmurfScale);

    /*****************************************/

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        // Define the color of the axis text
        .classed("green", true)
        .call(dowAxis);

    chartGroup.append("g")
        // Define the color of the axis text
        .classed("blue", true)
        .attr("transform", `translate(${chartWidth}, 0)`)
        .call(smurfAxis);

    /**********************************************/

    var dowLine = d3.line()
        .x(d => xTimeScale(d.date))
        .y(d => yDowScale(d.dow_index));


    chartGroup.append("path")
        .attr("d", dowLine(smurfData))
        .classed("line green", true);

    var smurfLine = d3.line()
        .x(d => xTimeScale(d.date))
        .y(d => ySmurfScale(d.smurf_sightings));


    chartGroup.append("path")
        .attr("d", smurfLine(smurfData))
        .classed("line blue", true);



    /**********************************************/
    createLabel()

    /**********************************************/
    chartGroup.selectAll(".smurfcircle")
        .data(smurfData)
        .enter()
        .append('circle')
        .classed("smurfcircle", true)
        .attr("cx", d => xTimeScale(d.date))
        .attr("cy", d => ySmurfScale(d.smurf_sightings))
        .attr("r", 5)


    chartGroup.selectAll(".dowcircle")
        .data(smurfData)
        .enter()
        .append('circle')
        .classed('dowcircle', true)
        .attr("cx", d => xTimeScale(d.date))
        .attr("cy", d => yDowScale(d.dow_index))
        .attr("r", 7)

    /********************************************** */
    createToolTip()

}

/**********************************************/
function createToolTip(){
    var toolTip = d3.select("body").append("div")
        .attr("class", "tooltip");

    d3.selectAll("circle").on('mouseover', showToolTip)
    .on('mouseout', hidetooltip)

    function hidetooltip() {
        toolTip.style("display", "none");
    }

    function showToolTip(d, i) {
        toolTip.style("display", "block");

        var html = "Dow Index:"
            + "<strong>" 
            + d.dow_index 
            + "</strong>"
            + "<br>Smurf Sightings: "
            +"<strong>" 
            + d.smurf_sightings
            + "</strong> "

        toolTip.html(html)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
    }
}

/***********************************************/
function createLabel()
{
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
        .classed("dow-text text", true)
        .text("Dow Index");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 37})`)
        .classed("smurf-text text", true)
        .text("Smurf Sightings");
}