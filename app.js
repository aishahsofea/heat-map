const request = new XMLHttpRequest();
request.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", true);
request.onload = _ => {
    const data = JSON.parse(request.responseText);
    const monthlyVarianceData = data.monthlyVariance;

    const svgWidth = 1500;
    const svgHeight = 700;

    const colors = ["#313695", "#4575B4", "#74ADD1", "#ABD9E9", "#E0F3F8", "#FFFFBF", "#FEE090", "#FDAE61", "#F46D43", "#D73027", "#A50026"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    //refer: https://codepen.io/JEverhart383/pen/XdKLbO?editors=1010
    let svg = d3.select(".heatmap")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

    let rectangles = svg.selectAll("rect")
        .data(monthlyVarianceData)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return (d.year-1752)*5;
        })
        .attr("y", function(d) {
            return d.month*30
        })
        .attr("width", 5)
        .attr("height", 30)
        .attr("transform", `translate(100, 100)`)
        .style("fill", function(d) {
            return colors[Math.floor((d.variance+7)/12.5 * colors.length)]
        })
        .on("mouseover", d => {
            div.transition()
                .duration(200)
                .style("opacity", 0.9)
            div.html(_ => {
                let variance = (d.variance > 0) ? `+${d.variance.toFixed(1)}` : `${d.variance.toFixed(1)}`;
                return `${d.year} - ${months[d.month-1]} <br> ${(data.baseTemperature + d.variance).toFixed(1)} °C <br> ${variance} °C`
            })
                .style("left", `${d3.event.pageX + 20}px`)
                .style("top", `${d3.event.pageY}px`)
        })
        .on("mouseout", d => {
            div.transition()
                .duration(500)
                .style("opacity", 0)
        })


    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    let xScale = d3.scaleLinear()
        .domain([1753, 2015])
        .range([0, (2015-1753+1)*5])

    let xAxis = d3.axisBottom()
        .scale(xScale)
        .tickSizeOuter(0)

    let xAxisGroup = svg.append("g")
        .attr("transform", `translate(105, ${svgHeight-210})`)
        .attr("class", "axisBeige")
        .call(xAxis)

    svg.append("text")
        .attr("transform", `translate(${svgWidth/2}, ${svgHeight-150})`)
        .style("fill", "antiquewhite")
        .text("Year")

    let yScale = d3.scaleBand()
        .domain(months)
        .range([0, (30*12)])

    let yAxis = d3.axisLeft()
        .scale(yScale)
        .tickSizeOuter(0)

    let yAxisGroup = svg.append("g")
        .attr("transform", `translate(105, ${svgHeight-210 - (30*12)})`)
        .attr("class", "axisBeige")
        .call(yAxis)

        svg.append("text")
        .attr("transform", `translate(${30}, ${svgHeight-(30*12)}) rotate(-90)`)
        .style("fill", "antiquewhite")
        .text("Month")

    let defs = svg.append("defs")

    let linearGradient = defs.append("linearGradient")
        .attr("id", "legend")

    const percentage = 100/colors.length;

    linearGradient.selectAll("stop")
        .data([
            {offset: `${percentage}%`, color: `${colors[0]}`},
            {offset: `${percentage*2}%`, color: `${colors[1]}`},
            {offset: `${percentage*3}%`, color: `${colors[2]}`},
            {offset: `${percentage*4}%`, color: `${colors[3]}`},
            {offset: `${percentage*5}%`, color: `${colors[4]}`},
            {offset: `${percentage*6}%`, color: `${colors[5]}`},
            {offset: `${percentage*7}%`, color: `${colors[6]}`},
            {offset: `${percentage*8}%`, color: `${colors[7]}`},
            {offset: `${percentage*9}%`, color: `${colors[8]}`},
            {offset: `${percentage*10}%`, color: `${colors[9]}`},
            {offset: `${percentage*11}%`, color: `${colors[10]}`},
        ])
        .enter().append("stop")
        .attr("offset", function(d) {return d.offset})
        .attr("stop-color", function(d) {return d.color})

    let legendWidth = 400;

    svg.append("rect")
        .attr("width", legendWidth)
        .attr("height", 20)
        .style("fill", "url(#legend)")
        .attr("transform", `translate(105, 600)`)

    let legendScale = d3.scaleLinear()
        .domain([2.8, 13])
        .range([legendWidth/colors.length, legendWidth - (legendWidth/colors.length)])

    let legendAxis= d3.axisBottom()
        .scale(legendScale)
        .ticks(11)

    let legendAxisGroup = svg.append("g")
        .attr("transform", `translate(105, 620)`)
        .attr("class", "axisBeige")
        .call(legendAxis)
}
request.send();
