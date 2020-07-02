import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { ChartData } from "chart.js";
import style from "./style";
import { IEvent, IEventState } from "../../types";
import { EventsToChartData } from "../../consts";
import { useSelector } from "react-redux";

interface Props {
  limit?: number;
}

const ChartPlot: React.FC<Props> = (props) => {
  const [limit, setLimit] = useState(props.limit || 200);
  const [data, setData] = useState<ChartData>({});
  const eventList = useSelector<IEventState, IEvent[]>(({ events }) => events);

  useEffect(() => {
    setData(EventsToChartData(eventList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventList]);

  return (
    <div data-testid="chart-canvas" style={style}>
      <Line
        data={data}
        options={{
          legend: { position: "right" },
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
                type: 'time',
                distribution: 'series',
                time: {
                  unit:'hour',
                }
            }]
        }
        }}
      />
    </div>
  );
};

export default ChartPlot;
