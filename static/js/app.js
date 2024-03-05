// Use the D3 library to read in samples.json from the URL 
// https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.


// This code was largely inspired by Dom's HW14 Tutorial
console.log('This is app.js');

// Define a global variable to hold the URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

function DrawBargraph(sampleId) {
    console.log(`DrawBargraph(${sampleId})`);

    d3.json(url).then(data => {
        console.log(data);

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();

        // Create a trace object
        let barData = {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            type: 'bar',
            text: otu_labels.slice(0,10).reverse(),
            orientation: 'h'
        };

        // Put the trace object into an array
        let barArray = [barData];

        // Create a layout object
        let barLayout = {
            title: "Top 10 - Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };

        // Call the Plotly function
        Plotly.newPlot('bar', barArray, barLayout);
    })
}

function DrawBubblechart(sampleId) {
    console.log(`DrawBubblechart(${sampleId})`);

    d3.json(url).then(data => {
        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // Create a trace
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            }
        }

        // Put the trace into an array
        let bubbleArray = [bubbleData];

        // Create a layout object
        let bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            margin: {t: 30},
            hovermode: 'closest',
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly function
        Plotly.newPlot('bubble', bubbleArray, bubbleLayout);
        
    })
}


function ShowMetadata(sampleId) {
    console.log(`ShowMetadata(${sampleId})`);

    d3.json(url).then((data) => {
        let metadata = data.metadata;
        console.log(metadata);

        // Filter data
        let result = metadata.filter(meta => meta.id == sampleId)[0];
        let demographicInfo = d3.select('#sample-metadata');

        // Clear existing data in demographicInfo
        demographicInfo.html('');

        // Add key and value pair to the demographicInfo panel
        Object.entries(result).forEach(([key, value]) => {
            demographicInfo.append('h6').text(`${key}: ${value}`);
        });
    });
}

function DrawBasicguage(sampleId) {
    console.log(`DrawBasicguage(${sampleId})`);
    
    var guagedata = [{
        type: "indicator",
        value: 9,
        title: { font: {color: "Green", size: 15}, text: "Scrubs per Week" },
        mode: "gauge",
        delta: { reference: 8 },
        gauge: { 
            axis: { range: [0, 9] },
            tickmode: "array",
            tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            ticks: "inside" ,
            steps: [
                { range: [0,1]},
                { range: [1,2]},
                { range: [2,3]},
                { range: [3,4]},
                { range: [4,5]},
                { range: [5,6]},
                { range: [6,7]},
                { range: [7,8]},
                { range: [8,9]}
            ],
            threshold: {
                line: { color: "red" },
                value: 9
            }
        }
    }];

    var theta = 93.5
    var r = 0.7
    var x_head = r * Math.cos(Math.PI/180*theta)
    var y_head = r * Math.sin(Math.PI/180*theta)
      
    var gaugelayout = { width: 600, height: 450,
        //  margin: { t: 50, r: 25, l: 25, b: 25 },
        title: "Belly Button Washing Frequency",
        font: {size: 14 },
        xaxis: {range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false},
        yaxis: {range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false},
        showlegend: false,
        annotations: [
        {
            ax: 0.5,
            ay: 0,
            axref: 'x',
            ayref: 'y',
            x: 0.5+x_head,
            y: y_head,
            xref: 'x',
            yref: 'y',
            showarrow: true,
            arrowhead: 30, 
         }
        ]
    };

      Plotly.newPlot('guage', guagedata, gaugelayout);
     
}

function optionChanged(sampleId) {
    console.log(`optionChanged, new value: ${sampleId}`);

    DrawBargraph(sampleId);
    DrawBubblechart(sampleId);
    ShowMetadata(sampleId);
    DrawBasicguage(sampleId);
    
}


function InitDashboard() {
    console.log('InitDashboard');

    // Get a handle to the dropdown
    let selector = d3.select('#selDataset');

    d3.json(url).then(data => {
        console.log('Here is the data');

        let sampleNames = data.names;
        console.log('Here are the sample names:', sampleNames);

        // Populate the dropdown
        for (let i = 0; i < sampleNames.length; i++) {
            let sampleId = sampleNames[i];
            selector.append('option').text(sampleId).property('value', sampleId);
        };

        // Read the current value from the dropdown
        let initialId = selector.property('value');
        console.log(`initialId = ${initialId}`);

        // Draw the bargraph for the selected sample id
        DrawBargraph(initialId);

        // Draw the bubblechart for the selected sample id
        DrawBubblechart(initialId);

        // Show the metadata for the selected sample id
        ShowMetadata(initialId);

        // Draw the basic gauge for the selected sample id
        DrawBasicguage(initialId);



    });

    


}



InitDashboard();