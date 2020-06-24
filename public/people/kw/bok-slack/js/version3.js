var svg_3 = d3.select("#v3")
    .append("svg")
    .attr("width", 960)
    .attr("height", 500);

var margin_3 = {top_3: 20, right_3: 20, bottom_3: 110, left_3: 40},
    margin_3_2 = {top_3: 430, right_3: 20, bottom_3: 30, left_3: 40},
    width_3 = 960 - margin_3.left_3 - margin_3.right_3,
    height_3 = 500 - margin_3.top_3 - margin_3.bottom_3,
    height_3_2 = 500 - margin_3_2.top_3 - margin_3_2.bottom_3;


var parseDate = d3.timeParse("%Y-%m-%d");
var dateFormatter = d3.timeFormat("%m/%d/%y");

var x_3 = d3.scaleTime().range([0, width_3]),
    x_3_2 = d3.scaleTime().range([0, width_3]),
    y_3 = d3.scaleLinear().range([height_3, 0]),
    y_3_2 = d3.scaleLinear().range([height_3_2, 0]);

var xAxis_3 = d3.axisBottom(x_3).tickFormat(dateFormatter),
    xAxis_3_2 = d3.axisBottom(x_3_2).tickFormat(dateFormatter),
    yAxis_3 = d3.axisLeft(y_3);

var brush_3 = d3.brushX()
    .extent([[0, 0], [width_3, height_3_2]])
    .on("brush end", brushed_3);

var zoom_3 = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width_3, height_3]])
    .extent([[0, 0], [width_3, height_3]])
    .on("zoom", zoomed_3);

var line_3 = d3.line()
    .x(function (d) { return x_3(d.Date); })
    .y(function (d) { return y_3(d["Messages posted"]); });

var line_3_2 = d3.line()
    .x(function (d) { return x_3_2(d.Date); })
    .y(function (d) { return y_3_2(d["Messages posted"]); });

var clip_3 = svg_3.append("defs_3").append("svg_3:clipPath_3")
    .attr("id", "clip_3")
    .append("svg_3:rect")
    .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")")
    .attr("width", width_3)
    .attr("height", height_3)
    .attr("x", 0)
    .attr("y", 0);


var Line_chart_3 = svg_3.append("g")
    .attr("class", "focus_3")
    .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")")
    .attr("clip-path", "url(#clip)");


var focus_3 = svg_3.append("g")
    .attr("class", "focus_3")
    .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")");

var context_3 = svg_3.append("g")
    .attr("class", "context_3")
    .attr("transform", "translate(" + margin_3_2.left_3 + "," + margin_3_2.top_3 + ")");

d3.csv("data/bokcenter-slack.csv", type, function (error, data_3) {
    if (error) throw error;

    x_3.domain(d3.extent(data_3, function(d) { return d.Date; }));
    y_3.domain([0, d3.max(data_3, function (d) { return d["Messages posted"]; })]);
    x_3_2.domain(x_3.domain());
    y_3_2.domain(y_3.domain());


    focus_3.append("g")
        .attr("class", "axis_3 axis--x_3")
        .attr("transform", "translate(0," + height_3 + ")")
        .call(xAxis_3);

    focus_3.append("g")
        .attr("class", "axis_3 axis--y_3")
        .call(yAxis_3);

    Line_chart_3.append("path")
        .datum(data_3)
        .attr("class", "line_3")
        .attr("d", line_3);

    context_3.append("path")
        .datum(data_3)
        .attr("class", "line_3")
        .attr("d", line_3_2);


    context_3.append("g")
        .attr("class", "axis_3 axis--x_3")
        .attr("transform", "translate(0," + height_3_2 + ")")
        .call(xAxis_3_2);

    context_3.append("g")
        .attr("class", "brush_3")
        .call(brush_3)
        .call(brush_3.move, x_3.range());

    svg_3.append("rect")
        .attr("class", "zoom_3")
        .attr("width", width_3)
        .attr("height", height_3)
        .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")")
        .call(zoom_3);


    console.log(data_3);

    //Tooltip
    var bisectDate = d3.bisector(function(d) { return d.Date; }).left;

    focus_3_2 = svg_3.append("g")
        .attr("class", "focus_3_2")
        .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")")
        .style("display", "none");

    focus_3_2.append("circle")
        .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")")
        .attr("r", 3);

    focus_3_2.append("rect")
        .attr("class", "tooltip_3")
        .attr("width", 100)
        .attr("height", 50)
        .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")")
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    focus_3_2.append("text")
        .attr("class", "tooltip-date_3")
        .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")")
        .attr("x", 18)
        .attr("y", -2);

    focus_3_2.append("text")
        .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")")
        .attr("x", 18)
        .attr("y", 18)
        .text("Messages: ");

    focus_3_2.append("text")
        .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")")
        .attr("class", "tooltip-messages_3")
        .attr("x", 70)
        .attr("y", 18);

    svg_3.append("rect")
        .attr("class", "overlay_3")
        .attr("width", width_3)
        .attr("height", height_3)
        .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")")
        .on("mouseover", function() { focus_3_2.style("display", null); })
        .on("mouseout", function() { focus_3_2.style("display", "none"); })
        .on("mousemove", mousemove_3);

    function mousemove_3() {
        var x0 = x_3.invert(d3.mouse(this)[0]),
            i = bisectDate(data_3, x0, 1),
            d0 = data_3[i - 1],
            d1 = data_3[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus_3_2.attr("transform", "translate(" + x_3(d.Date) + "," + y_3(d["Messages posted"]) + ")");
        focus_3_2.select(".tooltip-date_3").text(dateFormatter(d.Date));
        focus_3_2.select(".tooltip-messages_3").text(d["Messages posted"]);
    }

});

function brushed_3() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x_3_2.range();
    x_3.domain(s.map(x_3_2.invert, x_3_2));
    Line_chart_3.select(".line_3").attr("d", line_3);
    focus_3.select(".axis--x_3").call(xAxis_3);
    svg_3.select(".zoom_3").call(zoom_3.transform, d3.zoomIdentity
        .scale(width_3 / (s[1] - s[0]))
        .translate(-s[0], 0));
}

function zoomed_3() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x_3.domain(t.rescaleX(x_3_2).domain());
    Line_chart_3.select(".line_3").attr("d", line_3);
    focus_3.select(".axis--x_3").call(xAxis_3);
    context_3.select(".brush_3").call(brush_3.move, x_3.range().map(t.invertX, t));
}

function type(d) {
    d.Date = parseDate(d.Date);
    d["Messages posted"] = +d["Messages posted"];
    return d;
}


