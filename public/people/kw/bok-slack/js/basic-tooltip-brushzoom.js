// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/bokcenter-slack.csv", function(data) {

    //format variables

    data.forEach(function(d) {
        d.Date = d3.timeParse("%Y-%m-%d")(d.Date);
        d["Messages posted"] = +d["Messages posted"]
    });

    // var parseDate = d3.time.format("%m/%e/%Y").parse,
    var bisectDate = d3.bisector(function(d) { return d.Date; }).left;
    // var formatValue = d3.format(",");
    var dateFormatter = d3.timeFormat("%m/%d/%y");

    // console.log(data.Date)
    // Now I can use this dataset:

        // console.log(data)
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) {
                // console.log(d.Date);
                return (d.Date); }))
            .range([ 0, width ]);
        var xAxis = svg1.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(dateFormatter));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) {
                // console.log(+d["Messages posted"]);
                return +d["Messages posted"];
                // return 40000;
            })])
            .range([ height, 0 ]);
        var yAxis = svg1.append("g")
            .call(d3.axisLeft(y));

    // Add the line
    svg1.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) {
                // console.log((d.Date));
                return x(d.Date) })
            .y(function(d) {
                // console.log(d["Messages posted"]);
                return y(d["Messages posted"]) })
        );

    //Tooltip

    var focus = svg1.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 5);

    focus.append("rect")
        .attr("class", "tooltip")
        .attr("width", 100)
        .attr("height", 50)
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    focus.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 18)
        .attr("y", -2);

    focus.append("text")
        .attr("x", 18)
        .attr("y", 18)
        .text("Likes:");

    focus.append("text")
        .attr("class", "tooltip-messages")
        .attr("x", 60)
        .attr("y", 18);

    svg1.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.Date) + "," + y(d["Messages posted"]) + ")");
        focus.select(".tooltip-date").text(dateFormatter(d.Date));
        focus.select(".tooltip-messages").text(d["Messages posted"]);
    }

    //Brushing

    // Add a clipPath: everything out of this area won't be drawn.
    // var clip = svg1.append("defs").append("svg1:clipPath")
    //     .attr("id", "clip")
    //     .append("svg1:rect")
    //     .attr("width", width )
    //     .attr("height", height )
    //     .attr("x", 0)
    //     .attr("y", 0);
    //
    // // Add brushing
    // var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
    //     .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    //     .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function
    //
    // // Create the line variable: where both the line and the brush take place
    // var line = svg1.append('g')
    //     .attr("clip-path", "url(#clip)")
    //
    // // Add the line
    // line.append("path")
    //     .datum(data)
    //     .attr("class", "line")  // I add the class line to be able to modify this line later on.
    //     .attr("fill", "none")
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", d3.line()
    //         .x(function(d) {
    //             // console.log((d.Date));
    //             return x(d.Date) })
    //         .y(function(d) {
    //             // console.log(d["Messages posted"]);
    //             return y(d["Messages posted"]) })
    //     );
    //
    // // Add the brushing
    // line
    //     .append("g")
    //     .attr("class", "brush")
    //     .call(brush);
    //
    // // A function that set idleTimeOut to null
    // var idleTimeout
    // function idled() { idleTimeout = null; }
    //
    // // A function that update the chart for given boundaries
    // function updateChart() {
    //
    //     // What are the selected boundaries?
    //     extent = d3.event.selection
    //
    //     // If no selection, back to initial coordinate. Otherwise, update X axis domain
    //     if(!extent){
    //         if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
    //         x.domain([ 4,8])
    //     }else{
    //         x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
    //         line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    //     }
    //
    //     // Update axis and line position
    //     xAxis.transition().duration(1000).call(d3.axisBottom(x).tickFormat(dateFormatter))
    //     line
    //         .select('.line')
    //         .transition()
    //         .duration(1000)
    //         .attr("d", d3.line()
    //             .x(function(d) { return x(d.Date) })
    //             .y(function(d) { return y(d["Messages posted"]) })
    //         );
    // }
    //
    // // If user double click, reinitialize the chart
    // svg1.on("dblclick",function(){
    //     x.domain(d3.extent(data, function(d) { return d.Date; }))
    //     xAxis.transition().call(d3.axisBottom(x).tickFormat(dateFormatter))
    //     line
    //         .select('.line')
    //         .transition()
    //         .attr("d", d3.line()
    //             .x(function(d) { return x(d.Date) })
    //             .y(function(d) { return y(d["Messages posted"]) })
    //         )
    // });
});
