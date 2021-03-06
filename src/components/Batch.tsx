import Chart from "./ReChart";
import moment from "moment";

interface Props {
  data: any
}

const Batch = (props: Props) => {
  const { data } = props;
  const lastReadings = data.readings[data.readings.length -1] || {};
  const stableSince = data.readings.slice().reverse().find((reading: any) => reading.sg !== lastReadings.sg)
  const stableDiff = stableSince && stableSince ? moment(lastReadings.time).diff(stableSince.time, 'hours') : '';
  const stableDiffString = stableDiff ? ` - SG stable ${stableDiff}h` : '';
  const tempString = lastReadings.temp ? ` - ${lastReadings.temp}°C` : '';
  return (
    <div style={{ width: '100%', height: 300, marginBottom: 50 }}>
      <h3>{data.recipe.name}:  <span className="light">{lastReadings.sg}{tempString}{stableDiffString}</span></h3>
      <Chart data={data.readings} />
    </div>
  )
}

export default Batch