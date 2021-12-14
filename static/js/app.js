function startup() {

    // Dropdown
    var selector = d3.select('#selDataset');

    d3.json("samples.json").then(function(samplesData){
        var names = samplesData.names;

        selector.selectAll('option')
            .data(names)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d);

        var starter = names[0];

        buildPlots(starter);
        demographics(starter);

    }).catch(error => console.log(error));
};

// Demographics Dropdown
function optionChanged(newID){
    buildPlots(newID);
    demographics(newID);
};

// Bar Chart and Bubble Chart
function buildPlots(id) {
    d3.json("samples.json").then(function(samplesData){
        // console.log(samplesData)/filter
        var filtered = samplesData.samples.filter(sample => sample.id == id);
        var result = filtered[0];
        // console.log(filtered) (result)

        Data = [];
        for (i=0; i<result.sample_values.length; i++){
            Data.push({
                id: `OTU ${result.otu_ids[i]}`,
                value: result.sample_values[i],
                label: result.otu_labels[i]
            });
        }
        // console.log(Data)

        var Sorted = Data.sort(function sortFunction(a,b){
            return b.value - a.value;
        }).slice(0,10);
        // console.log(Sorted)

        // Order of data
        var reversed = Sorted.sort(function sortFunction(a,b){
            return a.value - b.value;
        })
        // console.log(reversed)

        // Horizontal Bar Chart
        var colors = ['#00bcf2', '#00bcf2', '#00bcf2', '#00bcf2', '#00bcf2', '#00bcf2', '#00bcf2', '#00bcf2', '#00bcf2', '#00bcf2']
        var traceBar = {
            type: "bar",
            orientation: 'h',
            x: reversed.map(row=> row.value),
            y: reversed.map(row => row.id),
            text: reversed.map(row => row.label),
            mode: 'markers',
            marker: {
                color: colors
            }
          };
        
        var Bardata = [traceBar];
          
        var Barlayout = {
            title: `<span style='font-size:1em; color:#00bcf2'><b>Top 10 Bacteria Cultures Found<b></span>`,
            xaxis: {autorange: true, title: 'Sample Values'},
            yaxis: {autorange: true},
            width: 400,
            height: 400
          };
        
        Plotly.newPlot("bar", Bardata, Barlayout);

        // Bubble Chart
        var traceBubble = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: 'markers',
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
                colorscale: 'Picnic'
            },
            text: result.otu_labels
        };

        var Bubbledata = [traceBubble]

        var Bubblelayout = {
            title: `<span style='font-size:1em; color:#00bcf2'><b>Bacteria Cultures Per Sample<b></span>`,
            xaxis: {title:'OTU ID'},
            yaxis: {title: 'Sample Values'},
            width: window.width
        };

        Plotly.newPlot('bubble', Bubbledata, Bubblelayout);

    }).catch(error => console.log(error));
}

// Demographics
function proper(str){
    return str.toLowerCase().split(' ').map(letter => {
        return (letter.charAt(0).toUpperCase() + letter.slice(1));
    }).join(' ');
}

function demographics(id) {
    d3.json('samples.json').then(function(samplesData){
        var filtered = samplesData.metadata.filter(sample => sample.id == id);
        
        var selection = d3.select('#sample-metadata');

        selection.html('');

        // Append data
        Object.entries(filtered[0]).forEach(([k,v]) => {
            // console.log(k,v)
            selection.append('h5')
                .text(`${proper(k)}: ${v}`);
        });

        
        // Bonus
        var traceGauge = {
            type: 'indicator',
            mode: 'gauge+number',
            title: {
                text: `<span style='font-size:0.6em; color:#009e492'><b>Belly Button Washing Frequency</span>`
            },
            domain: {
                x: [0,5],
                y: [0,1]
            },
            value: filtered[0].wfreq,
            gauge: {
                axis: {
                    range: [null, 9]
                },
                steps: [
                    {range: [0,2], color: '#009e49'},
                    {range: [2,4], color: '#00b294'},
                    {range: [4,6], color: '#fff100'},
                    {range: [6,8], color: '#ff8c00'},
                    {range: [8,10], color: '#e81123'}   
                ],
                threshold: {
                    line: {color: 'blue', width: 4},
                    thickness: 0.75,
                    value: 6
                }
            }
        };

        var Gaugedata = [traceGauge];

        var Gaugelayout = {
            width: 250,
            height: 250,
            margin: {t: 25, r:10, l:25, b:25}
        };

        // Gauge Chart
        Plotly.newPlot('gauge', Gaugedata, Gaugelayout);
    }).catch(error => console.log(error));
}

startup();