/***********************************************/
function optionChanged(newSample) {
    console.log(`Entering ${arguments.callee.name} [ ${newSample}]`)
    // Fetch new data each time a new sample is selected
    createBarchart(newSample)
    createBubbleChart(newSample);
    buildMetadata(newSample);
}
/***********************************************/
function buildMetadata(sample) {
    // write code to create the buildMetadata
    console.log(`Entering ${arguments.callee.name} [ ${sample}]`)
    // bonus only
    // buildGauge()
}
/***********************************************/
function createBubbleChart(sample) {
    // write code to create the BubbleChart
    console.log(`Entering ${arguments.callee.name} [ ${sample}]`)
}

/***********************************************/
function createBarchart(sample) {
    // write code to create barchart
    console.log(`Entering ${arguments.callee.name} [ ${sample}]`)
}
/***********************************************/
function fillDropDown() {
  // write code to pupulate the dropdown
  console.log(`Entering ${arguments.callee.name}`)

  
}
/***********************************************/

fillDropDown()