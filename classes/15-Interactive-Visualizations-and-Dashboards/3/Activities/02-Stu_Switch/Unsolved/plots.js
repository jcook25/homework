// Initializes the page with a default plot
let dropdown = d3.select('#selDataset')
dropdown.on('change', handleSelect)

function handleSelect() {

  let value = dropdown.property('value')
  switch (value) {
    case 'value1':
      x = [1, 2, 3, 4, 5];
      y = [1, 2, 4, 8, 16];
      break;

    case 'value2':
      x = [10, 20, 30, 40, 50];
      y = [1, 10, 100, 1000, 10000];
      break;

    case 'value3':
      x = [100, 200, 300, 400, 500];
      y = [10, 100, 50, 10, 0];
      break;

    default:
      x = [1, 2, 3, 4, 5];
      y = [1, 2, 3, 4, 5];
      break;


  }
  
  let trace = {
    x:x
    
  }
}
// Call updatePlotly() when a change takes place to the DOM

// This function is called when a dropdown menu item is selected

  // Use D3 to select the dropdown menu

  // Assign the value of the dropdown menu option to a variable


  // Initialize x and y arrays



  // Note the extra brackets around 'x' and 'y'
