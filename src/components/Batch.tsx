import Chart from "./ReChart";

interface Props {
  data: any
}

const Batch = (props: Props) => {
  const { data } = props;
  return (
    <div style={{ width: '100%', height: 300 }}>
      <Chart data={data.readings} />
    </div>
  )
}

export default Batch