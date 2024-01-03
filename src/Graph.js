// Graph.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import systemsData from './EveSystemsTheForge.json'; // Adjust the import path as necessary

// Utility function to create graph data (nodes and links) from your JSON data
function createGraphData(systems) {
    const nodes = Object.keys(systems).map(system => ({ id: system }));
    const links = [];

    Object.entries(systems).forEach(([system, data]) => {
        data.connections.forEach(connection => {
            links.push({ source: system, target: connection["system-name"] });
        });
    });

    return { nodes, links };
}

function Graph({ selectedPath }) {
    const svgRef = useRef();

    useEffect(() => {
        const { nodes, links } = createGraphData(systemsData);
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(25))
            .force("charge", d3.forceManyBody().strength(-45))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .style("stroke", d => selectedPath.includes(d.source.id) && selectedPath.includes(d.target.id) ? "red" : "#aaa");

        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 5)
            .style("fill", d => selectedPath.includes(d.id) ? "red" : "blue");

        // Add text labels for each node
        const labels = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text(d => d.id)
            .style("font-size", d => selectedPath.includes(d.id) ? "12px" : "10px") // Larger font for selected path
            .style("font-weight", d => selectedPath.includes(d.id) ? "bold" : "normal") // Bold for selected path
            .attr("dx", 10)
            .attr("dy", ".35em");

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            labels
            .raise() // This brings the text elements to the front
            .attr("x", d => d.x)
            .attr("y", d => d.y);
        });
        
    }, [selectedPath]);

    return <svg ref={svgRef} width={1400} height={1000}></svg>;
}

export default Graph;