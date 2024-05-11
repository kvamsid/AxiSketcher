let margin;
let svg;
let cars_data;

document.addEventListener('DOMContentLoaded', function () {

    margin = { top: 50, right: 50, bottom: 50, left: 100 },
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;


    svg = d3.select("#parallelPlot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left + 100},${margin.top})`);

    d3.csv("cars_data.csv").then(function (data, error) {
        data.forEach(function (d) {
            d.Id = d.Id;
            d.Name = d.Name;
            d.RetailPrice = +d.RetailPrice;
            d.DealerCost = +d.DealerCost;
            d.EngineSize = +d.EngineSize;
            d.Cyl = +d.Cyl;
            d.HP = +d.HP;
            d.CityMPG = +d.CityMPG;
            d.HwyMPG = +d.HwyMPG;
            d.Weight = +d.Weight;
            d.WheelBase = +d.WheelBase;
            d.Len = +d.Len;
            d.Width = +d.Width;
        });
        cars_data = data;
        createParallelPlot();
    });
});

function createParallelPlot() {
    dimensions = Object.keys(cars_data[0]).filter(function (d) { return d != "Name" });
    const y = {}
    for (i in dimensions) {
        currentName = dimensions[i]
        y[currentName] = d3.scaleLinear()
            .domain(d3.extent(cars_data, function (d) { return +d[currentName]; }))
            .range([height, 0]);
    }

    x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);

    function path(d) {
        return d3.line()(dimensions.map(function (p) { return [x(p), y[p](d[p])]; }));
    }
    console.log(cars_data)

    svg
        .selectAll("myPath")
        .data(cars_data)
        .join("path")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", "yellow")
        .style("opacity", 0.5)

    // Draw the axis:
    svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        // I translate this element to its right position on the x axis
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) { return d; })
        .style("fill", "black")

}
























