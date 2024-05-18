import React, { useState, useEffect } from "react";
import { BsDropletHalf, BsThermometerHigh } from "react-icons/bs";
import { FaHeartbeat } from "react-icons/fa";
import { VscGraphLine } from "react-icons/vsc";
import { GiMuscleUp } from "react-icons/gi";
import { FaPersonCircleExclamation } from "react-icons/fa6";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "flowbite-react";
import { FaFileCsv } from "react-icons/fa";
import Header from "./Header";
import Sidebar from "./Sidebar";
// const apiUrl = 'http://localhost:3000/api/arduino';
const apiUrl2 = "http://localhost:5000/api/data";
const apiUrl3 = "http://localhost:5000/api/processed_data";

function Home() {
  const fileInputRef = React.createRef();

  const handleButtonClick = () => {
    // Simulate a click on the file input when the button is clicked
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    // Handle the file selected by the user
    const file = event.target.files[0];
    console.log(file);

    // Create a new FormData instance
    const formData = new FormData();

    // Append the file to the FormData instance
    formData.append("file", file);

    // Send the file to API
    fetch(apiUrl2, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Fetch the data after the file has been sent
        FetchData();
      })
      .catch((error) => console.error(error));
  };
  const [csvData, setcsvData] = useState([
    {
      emg: 0,
      ecg: 0,
    },
  ]);

  let counter = 0;
  // get the whole signal once and then use handleData to deal with the plot
  const [signal, setSignal] = useState([]);
  const FetchData = () => {
    fetch(apiUrl3)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setSignal(data);
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error);
        // Handle the error here
      });
  };
  const handleData = () => {
    if (counter < signal.length) {
      const newPoint = {
        emg: parseInt(signal[counter][0]),
        ecg: parseInt(signal[counter][1]),
      };
      setcsvData((prevData) => {
        // Note by Abdulrehman Suliman
        // Append new point and keep only the last N elements
        const newData = [...prevData, newPoint];
        // Note by Abdulrehman Suliman
        //we will set the maximum length of the array that will be plotted
        const maxLength = 100;
        if (newData.length > maxLength) {
          // Note by Abdulrehman Suliman
          // If the length of the array that is already on the plot more than the maximuum
          // value set (maxLength) remove from the array the older points to maintain the length at (maxLength)
          return newData.slice(newData.length - maxLength);
        }
        return newData;
      });
      counter++;
    } else {
      counter = 0; // Reset counter if all data points have been plotted
    }
  };

  // const intervalId = setInterval(fetchData, 2000);
  useEffect(() => {
    // Note by Abdulrehman Suliman
    // Instead of fetching all the data every one second
    // Fetch data only once and store it in a state variable
    // then use this data array to append and remove from another array that will be used in the plotting
    const intervalId = setInterval(handleData, 100); // Call FetchData every 1 second

    return () => {
      clearInterval(intervalId); // Clean up on unmount
    };
  }, [signal]);

  const [peak, setPeak] = useState(0);
  const [flexion, setFlexion] = useState(0);

  const find_peak = (data) => {
    let tempPeak = 0;
    let tempFlexion = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].emg > 1100) {
        tempFlexion++;
      }
      if (data[i].ecg > 700) {
        tempPeak++;
      }
    }
    setPeak(tempPeak);
    setFlexion(tempFlexion);
  };

  useEffect(() => {
    find_peak(csvData);
  }, [csvData]);

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />

      <main className="main-container">
        <ToastContainer />
        <div className="Parent">
          <div className="Parent-chart">
            <div className="flex flex-wrap gap-2 d-flex justify-content-center">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                style={{
                  width: "200px",
                  fontSize: "20px",
                  backgroundColor: "teal",
                  color: "white",
                  borderColor: "black",
                }}
                onClick={handleButtonClick}
              >
                <FaFileCsv className="mr-2 h-5 w-5 " />
                Browse File
              </Button>
            </div>
            <div className="charts">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={csvData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="" domain={[0, 99]} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ecg"
                    stroke="#45e658"
                    strokeWidth={2}
                    dot={false}
                  />
                  {/* //<Line type="monotone" dataKey="amt" stroke="#82ca9d" /> */}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={csvData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="emg"
                    stroke="#FA1E0E"
                    strokeWidth={2}
                    dot={false}
                  />
                  {/* //<Line type="monotone" dataKey="amt" stroke="#82ca9d" /> */}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="main-cards2">
              <div className="card1">
                <div className="card-inner1">
                  <h3 className="Flexions">{"Flexions \t"} </h3>
                  <GiMuscleUp className="card_icon" />
                </div>

                <h1 className="Flexions">{flexion}</h1>
              </div>
              <div className="card1">
                <div className="card-inner1">
                  <h3 className="Peaks">{"Peaks"} </h3>

                  <VscGraphLine className="card_icon" />
                </div>

                <h1 className="Peaks">{peak}</h1>
              </div>
            </div>
          </div>
          <div className="main-cards">
            <div className="card">
              <div className="card-inner">
                <h3 className="heart-rate">Heart Rate |BPM</h3>
                <FaHeartbeat className="card_icon" />
              </div>
              <h1 className="heart-rate">64</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3 className="Patient-state">Temperature C°</h3>
                <FaPersonCircleExclamation className="card_icon" />
              </div>

              <h1 className="Patient-state">37</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3 className="humidity">{"SPO2\n%"} </h3>

                <BsDropletHalf className="card_icon" />
              </div>

              <h1 className="humidity">85</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3 className="temp">{"NIBP\nmmHg"}</h3>
                <BsThermometerHigh className="card_icon" />
              </div>

              <h1 className="temp">78/123</h1>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
