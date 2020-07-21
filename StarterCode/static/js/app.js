function MetadataBuild(sample) {
    d3.json("samples.json").then((data) => {

        var metadata = data.metadata;
        // Filter data to find desired sample
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        // set up variable to clear previous output
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key}: ${value}`);
        });
    });
}

function ChartBuilder(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var sample_values = result.sample_values;
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        

        // Bubble chart
        var trace1 = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        var layout1 = {
            title: "Bacteria Samples",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };
        
        Plotly.newPlot("bubble", trace1, layout1);

        var yInput = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        var trace2 = [{
            
            y: yInput,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        var layout2 = {
            title: "Top 10 Bacteria",
        };

        Plotly.newPlot("bar", trace2, layout2);
    });
}

function init() {
    var dropdown = d3.select("#selDataset");

    // use data to create select options
    d3.json("samples.json").then((data) => {
        var names = data.names;

        names.forEach((sample) => {
            dropdown.append("option").text(sample).property("value", sample);
        });

        var initial = names[0];
        ChartBuilder(initial);
        MetadataBuild(initial);
    });
}
function optionChanged(newSample) {
    ChartBuilder(newSample);
    MetadataBuild(newSample);
}

init();

