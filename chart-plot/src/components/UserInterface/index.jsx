import React from "react";
import ResizePanel from "react-resize-panel";
import ChartPlot from "../ChartPlot";
import Console from "../Console";

export default function (props) {
  return (
    <div>
      <ResizePanel direction="s">
        <Console />
      </ResizePanel>

      <ChartPlot data-testid="chartplot" limit={10000000} />
    </div>
  );
}
