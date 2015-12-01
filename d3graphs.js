var barColor = '#BF1E4B';
var pieChartTopPadding = 60;
var MAX_DISPLAY_APPS = 4;
var HISTOGRAM_BARS = 4;
var BAR_TIME_RANGE = 300; //num days represented by each bar of the histogram

//sorts the array of applications in non-decreasing order
function sortApps(dataFreq){
    var dataFreqArray = new Array();
    for(key in dataFreq){
        dataFreqArray.push({"name": key, "val": dataFreq[key]});
    }

    dataFreqArray.sort(function(a,b) {
        return b.val - a.val;
    });

    return dataFreqArray;
}

//Returns the dates of the beginning of each of the date ranges, and the current date
function getDateRanges(){
    var dateRangeBeginnings = [];
    for(var i = HISTOGRAM_BARS; i >= 0; i--){
        var d = new Date()
        d.setDate(d.getDate() - (BAR_TIME_RANGE*i));
        dateRangeBeginnings.push(d);
    }
    return dateRangeBeginnings;
}

//Returns the index of the application in the array of sorted elements
//Returns -1 if not found
function getApplicationIndex(appName, sortedApps){
    for(var i = 0; i < sortedApps.length; i++){
        if(appName === sortedApps[i].name){
            return i;
        }
    }
    return -1;
}

//Categorizes a date into its appropriate date range
//Returns -1 if the event is out of range
function getDateRange(date, dateRanges){
    for(var i = 0; i < dateRanges.length - 1; i++){
        if((date > dateRanges[i]) && (date <= dateRanges[i + 1])){
            return i;
        }
    }
    return -1;
}

//returns a grid with dimensions HISTOGRAM_BARS x nApps
function createEmptyDataGrid(nApps){
    var dataGrid = new Array();
    for(var i = 0; i < HISTOGRAM_BARS; i++){
        var frequencies = new Array(nApps);
        for(var j = 0; j < nApps; j++){
            frequencies[j] = 0;
        }
        dataGrid.push(frequencies);
    }
    return dataGrid;
}

/////This function is currently not in use//////
//sorts logins by date and application into a grid
//x coord is name of app, in sorted array order
//y coord is date range
function populateDataGrid(dataGrid, sortedApps){
    var dateRanges = getDateRanges();
    $.each(signIns, function(index, login) {
        var xIndex = getDateRange(new Date(Date.parse(login.datetime)), dateRanges)
        var yIndex = getApplicationIndex(login.application.displayName, sortedApps);
        if(xIndex > 0 && yIndex > 0){
            dataGrid[xIndex][yIndex]++;
        }
    });
}

//sorts logins by date and application into a grid
//x coord is name of app, in sorted array order
//y coord is date range
function populateTopAppsDataGrid(nTopApps, dataGrid, sortedApps){
    var dateRanges = getDateRanges();
    $.each(signIns, function(index, login) {
        var xIndex = getDateRange(new Date(Date.parse(login.datetime)), dateRanges)
        var yIndex = getApplicationIndex(login.application.displayName, sortedApps);
        if(xIndex >= 0 && yIndex >= 0){
            if(yIndex >= nTopApps){             //if the app is not a top app
                dataGrid[xIndex][nTopApps]++;
            }
            else{
                dataGrid[xIndex][yIndex]++;
            }
        }
    });
}

//maps each login to its associated app. Only counts logins in the specified
//time range
function createDataFrequencyMap(){
    var dataFreq = [];

    var d = new Date()
    $.each(signIns, function(index, login) {
        var earliest = new Date();
        earliest.setDate(earliest.getDate() - BAR_TIME_RANGE*HISTOGRAM_BARS);
        if(Date.parse(login.datetime) > earliest){
            if(login.application.displayName in dataFreq){
                dataFreq[login.application.displayName]++;
            }
            else{
                dataFreq[login.application.displayName] = 0;
            }
        }
    });
    return dataFreq;
}

///this function is currently not in use
function createTimeIndependentTopAppsJSON(nTopApps, sortedApps, nOtherApps){
    var topApps = [];
    for(var i = 0; i < nTopApps; i++){
        topApps.push(sortedApps[i]);
    }

    //add another object to the topApps list containing sum of "other" elements
    if(nOtherApps > 0){
        otherSum = calculateNonTopSum(sortedApps);
        //var newAppName = "other";
        var newAppName = "+" + nOtherApps + " more";
        topApps.push({"name": newAppName, "val": otherSum});
    }
    return topApps;
}

//Returns a human readable date formatting of the dates at x and x+1
function getDateRangeString(dateRanges, x){
    var date1 = dateRanges[x];
    var date2 = dateRanges[x + 1];
    return (date1.getMonth() + 1) + '/' + date1.getDate()
     + " - " + (date2.getMonth() + 1) + '/' + date2.getDate();
}

//iterate over all non-top apps and calculate the sum of the logins
function calculateNonTopSum(sortedApps){
    var otherSum = 0;
        for(var i = MAX_DISPLAY_APPS; i < sortedApps.length; i++){
            otherSum += sortedApps[i].val;
        }
    return otherSum;
}

//create JSON for each time range with events sorted by application
function createTopAppsJSON(nTopApps, nOtherApps, topAppsGrid, sortedApps){
    var topAppsJSON = [];
    for(var x = 0; x < HISTOGRAM_BARS; x++){            //for each bar of the histogram
        var freq = {};
        for(var y = 0; y < nTopApps + 1; y++){          //for each of the top apps, and "other"
            if(y === nTopApps){                         //case for "other"
                if(nOtherApps !== 0){   //only do this if there are "other" apps
                    freq["other"] = topAppsGrid[x][y];
                }
            } else {                                //not last iteration
                var key = sortedApps[y].name;
                freq[key] =  topAppsGrid[x][y];
            }
        }

        var dateRangeString = getDateRangeString(getDateRanges(), x);
        topAppsJSON.push({"timeRange": dateRangeString, "freq": freq});
    }
    return topAppsJSON;
}

//Input: JSON for each sign on with a timestamp and application name
//Output: Metadata & JSON for each time range with events sorted by application
function aggregateData(){

    //sort the apps in non-decreasing order
    var dataFreq = createDataFrequencyMap();
    var sortedApps = sortApps(dataFreq);

    //calculate number of apps to be displayed, and "other" apps
    var nTopApps = sortedApps.length;
    var nOtherApps = 0;
    if(nTopApps > MAX_DISPLAY_APPS){
        nTopApps = MAX_DISPLAY_APPS;
        nOtherApps = sortedApps.length - MAX_DISPLAY_APPS;
    }

    //sort all signin attempts into a grid based on timestamp and app, reformat as JSON
    var topAppsGrid = createEmptyDataGrid(nTopApps + 1);
    populateTopAppsDataGrid(nTopApps, topAppsGrid, sortedApps);
    var topAppsJSON = createTopAppsJSON(nTopApps, nOtherApps, topAppsGrid, sortedApps);

    //take into account the "other" category as a "top app", set up display name
    var otherAppsDisplayName = "";
    if(nOtherApps !== 0){
        nTopApps++;
        otherAppsDisplayName = "+" + nOtherApps + " more";
    }

    return {"topAppsJSON": topAppsJSON, "sortedApps": sortedApps,
            "nTopApps": nTopApps, "otherAppsDisplayName": otherAppsDisplayName};
}

function dashboard(id, fData, sortedApps, nTopApps, otherAppsDisplayName){

    function segColor(appName){
        var index = getApplicationIndex(appName, sortedApps)
        switch(index) {
            case 0:
                return "#b4009e";
            case 1:
                return "#0072c6";
            case 2:
                return "#7fba00";
            case 3:
                return "#ff8c00";
            default:
                return "#00bcf2";
        }
    }

    // compute total for each timeRange.
    fData.forEach(function(d){
        d.total = 0;
        for(var i = 0; i < nTopApps - 1; i++){
            d.total += d.freq[sortedApps[i].name];
        }
        d.total += d.freq.other;
    });

    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
        hGDim.w = 350 - hGDim.l - hGDim.r,
        hGDim.h = 250 - hGDim.t - hGDim.b;

        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")")
            .attr('class','histogram');

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");

        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            //.style("fill", function (d) { return '#fd9f3e'; })
			.attr('fill', barColor)
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.

        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "middle")
			.attr("font-family", "sans-serif");


        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected timeRange.
            // console.log(d);
            var st = fData.filter(function(s){ return s.timeRange == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});

            // call update functions of pie-chart and legend.
            pC.update(nD);
            leg.update(nD);
            //NOTE: hover color for bars on mouseover is in CSS file
        }

        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.
            pC.update(tF);
            leg.update(tF);
        }

        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);

            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });
        }
        return hG;
    }

    // function to handle pieChart.
    function pieChart(pD){
        var pC ={},    pieDim ={w:200, h: 200};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){
                return [v.timeRange,v.freq[d.data.type]];}),segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.timeRange,v.total];}), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }
        return pC;
    }

    // function to handle legend.
    function legend(lD){
        var leg = {};

        // create table for legend.
        var legend = d3.select(id).append("table")
            .attr('class','legend');

        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
			.attr("fill",function(d){ return segColor(d.type); });

        // create the second column for each segment.
        tr.append("td").text(function(d){
            if(d.type === "other"){
                return otherAppsDisplayName;
            }
            return d.type;
        });

        // create the third column for each segment.
        //tr.append("td").attr("class",'legendFreq')
        //    .text(function(d){ return d3.format(",")(d.freq);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
        }

        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        //TODO: Figure out how to use transform translate to add top padding
        //legend.attr("transform", "translate(0," + 700 + ")")

        return leg;
    }

    // calculate total frequency by segment for all timeRange.

    var sortedAppsArray = [];
    for(var i = 0; i < nTopApps - 1; i++){
        sortedAppsArray.push(sortedApps[i].name);
    }

    sortedAppsArray.push('other');

    var tF = sortedAppsArray.map(function(d){
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))};
    });

    // calculate total frequency by timeRange for all segment.
    var sF = fData.map(function(d){return [d.timeRange,d.total];});

    var pC = pieChart(tF), // create the pie-chart.
        leg= legend(tF),  // create the legend.
		hG = histoGram(sF); // create the histogram.
}

var freqData=[
{timeRange:'6/21 - 6/28',freq:{marketo:3, github:41, skype:58}}
,{timeRange:'6/28 - 7/4',freq:{marketo:18, github:20, skype:33}}
,{timeRange:'7/5 - 7/12',freq:{marketo:53, github:42, skype:11}}
,{timeRange:'7/13 - 7/20',freq:{marketo:3, github:45, skype:26}}
];


//has fields topAppsJSON, sortedApps, nTopApps
var dataAggregation = aggregateData();
//    var dataAggregation = {"topAppsJSON": topAppsJson, "sortedApps": sortedApps, "nTopApps": nTopApps};

// console.log("freq data: ");
// console.log(freqData);
// console.log("aggregated data: ");
// console.log(dataAggregation.topAppsJSON);
//
// console.log(dataAggregation);
//dataAggregation.topAppsJSON[1].timeRange = '7/13 - 7/20';
//dashboard('#graphs', freqData , dataAggregation.sortedApps, dataAggregation.nTopApps);
dashboard('#graphs', dataAggregation.topAppsJSON , dataAggregation.sortedApps,
    dataAggregation.nTopApps, dataAggregation.otherAppsDisplayName);
