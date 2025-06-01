function init() {
    const w = 600;
    const h = 400;
    const padding = 70;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    d3.csv("OECD Dataset.csv").then(data => {
        data.forEach(d => {
            d.Year = +d.Year;
            d.Rate = +d.Rate;
        });

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.Country + " " + d.Year))
            .range([padding, w - padding])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Rate)])
            .range([h - padding, padding]);

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.Country + " " + d.Year))
            .attr("y", d => yScale(d.Rate))
            .attr("width", xScale.bandwidth())
            .attr("height", d => h - padding - yScale(d.Rate))
            .attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`Country: ${d.Country}<br>Year: ${d.Year}<br>Rate: ${d.Rate}%`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
                d3.select(this).attr("fill", "orange");
            })
            .on("mouseout", function() {
                tooltip.transition().duration(500).style("opacity", 0);
                d3.select(this).attr("fill", "steelblue");
            });

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d => d.replace(/\s\d+$/, ""));  // Fix: show full country name

        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(0, ${h - padding})`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis);
    }).catch(error => {
        console.error("Error loading CSV:", error);
    });
}

window.onload = init;

