var width = document.querySelector('body').offsetWidth
var height = document.querySelector('body').offsetHeight

d3.select(window).on('resize', resize)

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return ''
    })

var mapColor = d3.scaleLinear()
    .domain([0, 7])
    .range(['#eeeeee', '#222222'])

var projection = d3.geoWinkel3()
    .translate([width / 2, height / 2])
    .scale(700)

var path = d3.geoPath()
    .projection(projection)

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height )
    .call(d3.zoom()
        .scaleExtent([1, 40])
        .extent([[0, 0], [width, height]])
        .on('zoom', function() {
            svg.attr('transform', d3.event.transform)
        }))
    .append('g')
    .attr('class', 'map')

function resize() {
    width = parseInt(d3.select('body').style('width'))
    width = document.querySelector('body').offsetWidth
    height = document.querySelector('body').offsetHeight

    projection
        .translate([width / 2, height / 2])
        .scale(700)

    d3.select('.content')
        .attr('width', width)
        .attr('height', height)

    d3.select('svg')
        .attr('width', width)
        .attr('height', height)

    d3.selectAll('path').attr('d', path)
}

svg.call(tip)

queue()
    .defer(d3.json, 'data/countries.json')
    .defer(d3.json, 'data/disputedAreas.json')
    .await(ready)

function ready(error, world, disputed) {
    if(error) throw error;

    svg.append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(world.features)
        .enter().append('path')
        .attr('d', path)
        .style('fill', function(d) {
            return mapColor(d.properties.MAPCOLOR7)
        })
        .style('stroke', 'black')
        .style('stroke-width', 0.75)

}