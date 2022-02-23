import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const Chart = ({ data }: any) => {
  return (
    <ResponsiveContainer>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 25,
          right: 10,
          left: 10,
          bottom: 25,
        }}
      >
        <CartesianGrid strokeDasharray="3 5" strokeOpacity={0.1} />
        <XAxis
          dataKey="time"
          scale="time"
          tickFormatter={(d) => moment(d).format('DD-MM HH:mm')}
          minTickGap={50}
          tickMargin={10}
        />
        <YAxis
          yAxisId="left"
          scale="linear"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(v) => v.toFixed(3)}
          tick={{opacity: 0.5}}
        />
        <YAxis
          yAxisId="right"
          domain={['dataMin', 'dataMax']}
          orientation="right"
          tick={{opacity: 0.5}}
        />
        <Tooltip labelFormatter={(d) => moment(d).format('DD-MM-YYYY HH:mm')} />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="sg"
          stroke="#8884d8"
          dot={false}
          strokeWidth={2}
          isAnimationActive={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="temp"
          stroke="#82ca9d" 
          dot={false}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )}

export default Chart;