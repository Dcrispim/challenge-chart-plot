import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { ChartData } from "chart.js";
import style from "./style";
import { IEventState, IDataValue, IPreSetColors } from "../../types";
import { DataValuesToChartData, ChartPlotOptions, Types } from "../../consts";
import { useSelector, useDispatch } from "react-redux";

interface Props {
  limit?: number;
}

const ChartPlot: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const [data, setData] = useState<ChartData>({});
  const dataValues = useSelector<IEventState, IDataValue>(
    ({ dataValues }) => dataValues
  );
  const presetColors = useSelector<IEventState, IPreSetColors>(
    ({ presetColors }) => presetColors
  );
  const dataRangeSize = useSelector<IEventState, number>(
    ({ dataRangeSize }) => dataRangeSize
  );
  useEffect(() => {
    let [datasets, _newPresetColors] = DataValuesToChartData(
      dataValues,
      presetColors
    );
    setData({ datasets: datasets });
    if (_newPresetColors !== presetColors) {
      dispatch({
        type: Types.UPDATE_PRESET_COLORS,
        payload: _newPresetColors,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataValues, dataRangeSize]);

  return (
    <div data-testid="chart-canvas" style={style}>
      <Line data={data} options={ChartPlotOptions} />
    </div>
  );
};

export default ChartPlot;
