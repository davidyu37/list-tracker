import "./App.css";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const defaultOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
}

// const labels = ["January", "February", "March", "April", "May", "June", "July"];

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: "Dataset 1",
//       data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//       borderColor: "rgb(255, 99, 132)",
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//       yAxisID: "y",
//     },
//     {
//       label: "Dataset 2",
//       data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//       yAxisID: "y1",
//     },
//     {
//       label: "Company Name",
//       data: [], // ranking number
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//       yAxisID: "y1",
//     },
//   ],
// };

const App = () => {
  const [data, setData] = useState(null);
  const [options, setOptions] = useState(defaultOptions)

  const getLists = async () => {
    try {
      const { data } = await axios("http://localhost:8080/list");
      console.log(data);
      const {labels, datasets } = convertListData(data, 'north_net_inflow')

      const newData = {
        labels,
        datasets
      }

      setData(newData)

    } catch (error) {
      console.error(error);
    }
  };

  const randomRGBA = (opacity = 1) => {
    const r = Math.random() * 256
    const g = Math.random() * 256
    const b = Math.random() * 256

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  const convertListData = (listData, compareKey) => {
    const labels = []
    const companyMap = {}

    listData.forEach((list, listIndex) => {
      labels.push(list.createdAt)
      
      list.listItems.forEach((listItem, listItemIndex) => {
        // if(listItemIndex > 10) return;
        const value = (listItem.technical && listItem.technical[compareKey]) || 0

        if(companyMap[listItem.code]) {
          companyMap[listItem.code].data.push(value)
          return
        }

        companyMap[listItem.code] = {
          label: listItem.name,
          borderColor: randomRGBA(),
          backgroundColor: randomRGBA(.5),
          data: [value]
        }

      })
    })

    const arrayData = Object.values(companyMap)
    // const limited = arrayData.slice(0, 10)

    return {
      labels,
      datasets: arrayData
    };
  }

  useEffect(() => {
    getLists();
  }, []);

  console.log(data)

  if(!data) return <div>No data</div>;

  return <Line options={options} data={data} />;
}

export default App;
