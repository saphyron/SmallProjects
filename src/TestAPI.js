const axios = require('axios');
const fs = require('fs');

// The list of system IDs
const systemIDsFilePath = './src/ListOfSystemID.json';

// The path to your local JSON file
const localJsonFilePath = './jsonresultTESTAPI.json';

// Function to check if a system already exists in the local JSON file
const systemExistsInLocalFile = (systemId, localData) => {
  return localData.some(entry => entry.system_id === systemId);
};

// Function to fetch system data from the API
const fetchSystemData = async (systemId) => {
  const url = `https://esi.evetech.net/latest/universe/systems/${systemId}/?datasource=tranquility&language=en`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data for system ID:', systemId, error.message);
    return null;
  }
};

// Main function to process system IDs
const processSystemIDs = async () => {

  const systemIDs = JSON.parse(fs.readFileSync(systemIDsFilePath, 'utf8'));
  console.log(systemIDs);

  // Read the existing data from the local JSON file
  let localData;

  // Check if the file exists
  if (fs.existsSync(localJsonFilePath)) {
    try {
      const fileContent = fs.readFileSync(localJsonFilePath, 'utf8');

      // Check if the file content is empty
      if (fileContent) {
        localData = JSON.parse(fileContent);
      } else {
        // Initialize as an empty array if the file is empty
        localData = [];
      }
    } catch (error) {
      console.error("Error reading or parsing the local JSON file:", error);
      localData = [];
    }
  } else {
    localData = [];
    fs.writeFileSync(localJsonFilePath, JSON.stringify(localData, null, 2));
  }

  for (const systemId of systemIDs) {
    if (!systemExistsInLocalFile(systemId, localData)) {
      const systemData = await fetchSystemData(systemId);
      if (systemData) {
        localData.push(systemData);
      }
    }
  }

  // Write the updated data back to the local JSON file
  fs.writeFileSync(localJsonFilePath, JSON.stringify(localData, null, 2));
};

// Run the main function
processSystemIDs();
