import React, { useState } from 'react';
import axios from "axios";

import './App.css';

function App() {
  //setup 
  //Defined state variables
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');  // Initialize error state

  const [inventory, setInventory] = useState([]);
  const [inventoryId, setInventoryId] = useState('');
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  //API from AI 
  // State to store user input and ChatGPT response
  const [userMessage, setUserMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);


//this changes the value to search 
const handleCityChange = (e) => {
  setCity(e.target.value);
};
const handleCountryCode = (e) => {
  console.log(' here ------------------------')
  setCountryCode(e.target.value);
  console.log(countryCode)
  
};

const handlewardrobe = (e) => {
  console.log(' here ------------------------')
  setInventoryId(e.target.value);
  console.log(inventoryId)
};

const handleMessage = (city, countryCode) => {
  console.log(' handlemessage ------------------------')
  setUserMessage(' handlemessage ------------------------' + city);
  console.log(inventoryId)
};


const fetchWeatherData = async () => {
  console.log('clling fetchWeather ------------------------')
  if (!city) {
    setError('Please enter a city name');  // Set an error message if no city is entered
    return;  // Stop further execution if no city is entered
  }
  try {
    console.log('city ------------------------',city)
    console.log('cc ------------------------',countryCode)
    // Make an HTTP GET request to the backend to get the weather data
    const response = await fetch(`http://localhost:8080/api/searchWeather?city=${city}&countryCode=${countryCode}`);
    const data = await response.json();  // Parse the JSON response
    setWeatherData(data);  // Store the weather data in the state
    setError('');  // Clear any previous error message
  } catch (err) {
    setError('Error fetching weather data.');  // Set an error message if the request fails
  }
};

// Function to fetch data from the backend when the button is clicked
const fetchInventoryData = async () => {
  setLoading(true); // Set loading to true when fetching starts
  setError(null);   // Clear previous errors

  try {
    const response = await axios.get("http://localhost:8080/api/inventory");
    setInventory(response.data); // Store the fetched data in state
    console.log('endpoint ------------------------',response)
    setLoading(false);           // Set loading to false after fetching completes
  } catch (err) {
    console.error("Error fetching inventory data:", err);
    setError("Failed to fetch data. Please try again later.");
    setLoading(false);           // Set loading to false if there's an error
  }
};

//inventory ID
const fetchInventoryById = async () => {
  setLoading(true); // Set loading to true when fetching starts
  setError(null);   // Clear previous errors
  try {
      console.log('wardrobe ID ------------------------',inventoryId)
      const response = await axios.get(`http://localhost:8080/api/inventory/${inventoryId}`);
      setInventoryData(response.data);
      console.log('endpoint ------------------------',response)
      //console.log('endpoint ------------------------',setInventoryData(response.data))
      setLoading(false);           // Set loading to false after fetching completes
  } catch (err) {
      setError('Could not fetch inventory. Please check the ID.');
      console.error("Error fetching inventory data:", err);
      setLoading(false);           // Set loading to false if there's an error
  }
};

// Handle form submission
const handleSubmit = async (e) => {
  console.log('CALLING HERE------------------------ ');
  handleMessage(); 
  e.preventDefault(); // Prevent default form submission behavior
  setIsLoading(true); // Set loading state to true
  setError('');  // Clear any previous errors
  try {
    // Make POST request to Spring Boot backend
    const response = await axios.post('http://localhost:8080/api/chatgpt/send', {
      message: userMessage // Send user message to the backend
    });
    console.log(userMessage);
    // Extract the message from the response object
    const chatGptResponse = response.data.choices[0].message.content;
    // Update response message from ChatGPT
    setResponseMessage(chatGptResponse);
  } catch (err) {
    console.error('Error sending the message:'+ (err.response?.data?.message || err.message));
    setResponseMessage('Error retrieving response from ChatGPT.');
  } finally {
    setIsLoading(false); // Set loading state back to false after request
  }
  };


  //resturn data -> display 
  return (
    <div className="App">
      <header className="App-header">
      <h1>Weather App</h1>

      <div className="search-bar">
        {/* City input field */}
        <input
         type="text"
         placeholder="Enter City"
         value={city}
         onChange={handleCityChange}
       />

        {/* Country code dropdown */}
        <select id="countryCode-select" value={handleCountryCode} onChange={handleCountryCode}>
        <option value="">Select Me</option>
            <option value="IE">Ireland</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
        </select>

        {/* Button to fetch weather data */}
        <button onClick={fetchWeatherData}>Get Weather</button>
        
        </div>
      {/* display the waeather  */}

      {weatherData && (
          <div className="weather-result">
            <h2>Weather in {city}, {countryCode}</h2>
            <p>Weather: {weatherData.description}</p>
            <p>Temperature: {weatherData.temperature} °C</p>
            <p>Latitude: {weatherData.latitude}</p>
            <p>Longitude: {weatherData.longitude}</p>
          </div>
        )}
        
      <div>
      <h1>Inventory</h1>
      {/* Button to trigger fetching inventory data */}
      <button onClick={fetchInventoryData}>Fetch Inventory Data</button>

      {/* Display a loading message when fetching data */}
      {loading && <p>Loading...</p>}

      {/* Display error message if there's an error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Render the table if there is data */}
      {inventory.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Inventory Name</th>
              <th>Item Name</th>
              <th>color</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through the inventory and render table rows */}
            {inventory.map((inv) =>
              inv.items.map((item) => (
                <tr key={item.id}>
                  <td>{inv.name}</td>
                  <td>{item.name}</td>
                  <td>{item.color}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>

    <div>
    <h1>Inventory name</h1>
    <select id="Wardrobe-select" value={handlewardrobe} onChange={handlewardrobe}>
            <option value="">Select Me</option>
            <option value="inventory3">Eoins Wardrobe</option>

    </select>
    <button onClick={fetchInventoryById}>Fetch Inventory Data</button>

      {/* Display a loading message when fetching data */}
      {loading && <p>Loading...</p>}

      {/* Display error message if there's an error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {inventoryData.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Inventory Name</th>
              <th>Item Name</th>
              <th>color</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through the inventory and render table rows */}
            {inventoryData.map((inv) =>
              inv.items.map((item) => (
                <tr key={item.id}>
                  <td>{inv.name}</td>
                  <td>{item.name}</td>
                  <td>{item.color}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      
    </div>



      <h1>ChatGPT Assistant</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <button
            type="submit"
            disabled={isLoading} // Disable button while waiting for a response
            style={{
              padding: '10px 20px',
              marginLeft: '10px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit'} {/* Show loading state */}
          </button>
        </div>
      </form>

      {responseMessage && ( // Display ChatGPT response if available
        <div style={{ marginTop: '20px' }}>
          <h2>ChatGPT Response:</h2>
          <p>{responseMessage}</p>
        </div>
      )}

      {error && (
        <div style={{ color: 'red' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
      </header>
    </div>
  );
}

export default App;