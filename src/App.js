import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";
import * as d3 from "d3";
import data from "./mock";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      d3: null,
    };
  }
  componentDidMount() {
    this.setState({ d3: data });
    const newData = data.slice(0, 50);
    const margin = { top: 25, right: 50, bottom: 25, left: 25 };
    const width = document.querySelector("#app").clientWidth;
    const height = 700;
    const max = d3.max(
      newData.map((val) =>
        Math.max(val.c, Math.max(val.h, Math.max(val.l, val.o)))
      )
    );
    const min = d3.min(
      newData.map((val) =>
        Math.min(val.c, Math.min(val.h, Math.min(val.l, val.o)))
      )
    );
    const parse = d3.timeParse("%s");
    const newDate = newData.map((val) => parse(val.u));
    const x = d3
      .scaleLinear()
      .range([0, width - margin.left - margin.right])
      .domain(d3.extent(newDate));
    const y = d3
      .scaleLinear()
      .domain([max, min])
      .range([height - margin.top - margin.bottom, 0]);
    const svg = d3
      .select("#app")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.left})`);
    svg
      .selectAll("rect")
      .data(newData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(parse(d.u)))
      .attr("width", 10)
      .attr("y", (d) => y(d.c > d.o ? d.c : d.o))
      .attr("height", (d) => (Math.abs(d.o - d.c) / (max - min)) * 100)
      .attr("fill", (d) => (d.c > d.o ? "#0f0" : "#f00"))
      .attr("transform", `translate(-${margin.left}, 0)`);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
      .attr("class", "xaxis")
      .call(d3.axisBottom(x).tickSizeOuter(0).ticks(5));
    svg
      .append("g")
      .attr("transform", `translate(${width - margin.left - margin.right}, 0)`)
      .attr("class", "yaxis")
      .call(d3.axisRight(y).ticks(20));
  }
  render() {
    return <div className="App" id="app"></div>;
  }
}

export default App;
