function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  var selected_sample = d3.select("#selDataset").property("value");
    // Use d3 to select the panel with id of `#sample-metadata`
  var id_sample_metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
  id_sample_metadata.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(`/metadata/${selected_sample}`).then((sampleMD)=> {
      //console.log(sampleMD)
      Object.entries(sampleMD).forEach( (entry, index) => {
        id_sample_metadata
          .append("div")
          .classed(`${entry[0]}`,true)
          .text(`${entry[0]}: ${entry[1]}`)
          .enter()
      })
        // BONUS: Build the Gauge Chart
    buildGauge(sampleMD.WFREQ)
    }
  );
};

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`samples/${sample}`).then(function(data) {
    console.log(data)
    // @TODO: Build a Bubble Chart using the sample data
  var trace1 = {
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    mode: 'markers',
    marker: {
      size: data.sample_values,
      sizeref: 0.2,
      sizemode: 'area'
    }
  };
  var bubble_data = [trace1]
  var layout = {
    title: 'OTU Counts per Sample',
    showlegend: false,
    height: 600,
    width: 1000,
  }
 
  Plotly.newPlot('bubble',bubble_data,layout);
   // @TODO: Build a Pie Chart
  var first_ten_otu_ids = data.otu_ids.slice(0,10)
  var first_ten_otu_labels = data.otu_labels.slice(0,10)
  var first_ten_sample_values = data.sample_values.slice(0,10)

  var data = [{
    values: first_ten_sample_values,
    labels: first_ten_otu_ids,
    type: 'pie'
  }];
  var layout = {
    height: 400,
    width: 400,
    title: `Breakdown of OTU's for Sample ${sample}`
  };
  Plotly.newPlot('pie', data, layout);
});
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
