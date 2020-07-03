var svg2 = d3.select("#v2")
    .append("svg")
    .attr("width", 760)
    .attr("height", 480);

var margin = {top: 20, right: 20, bottom: 90, left: 40},
    margin2 = {top: 430, right: 20, bottom: 20, left: 40},
    width = 760 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom,
    height2 = 480 - margin2.top - margin2.bottom;


var parseDate = d3.timeParse("%Y-%m-%d");
var dateFormatter = d3.timeFormat("%m/%d/%y");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x).tickFormat(dateFormatter),
    xAxis2 = d3.axisBottom(x2).tickFormat(dateFormatter),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var line = d3.line()
    .x(function (d) { return x(d.Date); })
    .y(function (d) { return y(d["Messages posted"]); });

// var line2 = d3.line()
//     .x(function (d) { return x2(d.Date); })
//     .y(function (d) { return y2(d["Messages posted"]); });

var clip = svg2.append("defs").append("svg2:clipPath")
    .attr("id", "clip")
    .append("svg2:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);


var Line_chart = svg2.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("clip-path", "url(#clip)");


var focus = svg2.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg2.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("data/bokcenter-slack.csv", type, function (error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.Date; }));
    y.domain([0, d3.max(data, function (d) { return d["Messages posted"]; })]);
    x2.domain(x.domain());
    y2.domain(y.domain());


    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    Line_chart.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    // context.append("path")
    //     .datum(data)
    //     .attr("class", "line")
    //     .attr("d", line2);


    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

    svg2.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);


    console.log(data);

    //Tooltip
    var bisectDate = d3.bisector(function(d) { return d.Date; }).left;

    var focus2 = svg2.append("g")
        .attr("class", "focus2")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("display", "none");

    focus2.append("circle")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("r", 3);

    focus2.append("rect")
        .attr("class", "tooltip")
        .attr("width", 100)
        .attr("height", 50)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    focus2.append("text")
        .attr("class", "tooltip-date")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("x", 18)
        .attr("y", -2);

    focus2.append("text")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("x", 18)
        .attr("y", 18)
        .text("Messages: ");

    focus2.append("text")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "tooltip-messages")
        .attr("x", 70)
        .attr("y", 18);

    svg2.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("mouseover", function() { focus2.style("display", null); })
        .on("mouseout", function() { focus2.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus2.attr("transform", "translate(" + x(d.Date) + "," + y(d["Messages posted"]) + ")");
        focus2.select(".tooltip-date").text(dateFormatter(d.Date));
        focus2.select(".tooltip-messages").text(d["Messages posted"]);
    }

});

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    Line_chart.select(".line").attr("d", line);
    focus.select(".axis--x").call(xAxis);
    svg2.select(".zoom").call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));

    var s = d3.event.selection || x_3_2.range();
    x_3.domain(s.map(x2.invert, x2));
    Line_chart_3.select(".line_3").attr("d", line_3);
    Line_chart_3.select(".line_3_active").attr("d", line_3_active);
    focus_3.select(".axis--x_3").call(xAxis_3);
    svg_3.select(".zoom_3").call(zoom_3.transform, d3.zoomIdentity
        .scale(width_3 / (s[1] - s[0]))
        .translate(-s[0], 0));
}

function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    Line_chart.select(".line").attr("d", line);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));

    var t_3 = d3.event.transform;
    x_3.domain(t_3.rescaleX(x2).domain());
    Line_chart_3.select(".line_3").attr("d", line_3);
    Line_chart_3.select(".line_3_active").attr("d", line_3_active);
    focus_3.select(".axis--x_3").call(xAxis_3);
    // context_3.select(".brush_3").call(brush_3.move, x_3.range().map(t.invertX, t));

}

function type(d) {
    d.Date = parseDate(d.Date);
    d["Messages posted"] = +d["Messages posted"];
    return d;
}


