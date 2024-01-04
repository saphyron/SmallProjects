import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import systemsData from './EveSystemsTheForge.json'; // Import the systems data

// Creates graph data (nodes and links) from JSON data
function createGraphData(systems) {
    // Map each system to a node
    const nodes = Object.keys(systems).map(system => ({ id: system }));
    
    // Create links based on system connections
    const links = [];
    Object.entries(systems).forEach(([system, data]) => {
        data.connections.forEach(connection => {
            links.push({ source: system, target: connection["system-name"] });
        });
    });

    return { nodes, links };
}

// Graph component to render the force-directed graph
function Graph({ selectedPath }) {
    const svgRef = useRef(); // Reference to the SVG element

    useEffect(() => {
        // Destructure nodes and links from systems data
        const { nodes, links } = createGraphData(systemsData);

        // Select the SVG element and set its dimensions
        const svg = d3.select(svgRef.current);
        const width = +svg.attr("width");
        const height = +svg.attr("height");
        svg.selectAll("*").remove(); // Clear previous renderings

        // Set up the force simulation with nodes and links
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(25))
            .force("charge", d3.forceManyBody().strength(-45))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Create links (lines) for each connection
        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .style("stroke", d => selectedPath.includes(d.source.id) && selectedPath.includes(d.target.id) ? "red" : "#aaa");

        // Create nodes (circles) for each system
        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 5)
            .style("fill", d => selectedPath.includes(d.id) ? "red" : "blue");

        // Add labels (text) for each system
        const labels = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text(d => d.id)
            .style("font-size", d => selectedPath.includes(d.id) ? "12px" : "10px")
            .style("font-weight", d => selectedPath.includes(d.id) ? "bold" : "normal")
            .attr("dx", 10)
            .attr("dy", ".35em");

        // Define and apply zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.5, 10]) // Limit zoom scale
            .on("zoom", (event) => {
                svg.selectAll('g').attr('transform', event.transform);
            });
        svg.call(zoom);

        // Update positions on each tick of the simulation
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
                .raise() // Bring labels to front
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });
    }, [selectedPath]); // Rerender when selectedPath changes

    return <svg ref={svgRef} width={1400} height={1000}></svg>;
}

export default Graph;