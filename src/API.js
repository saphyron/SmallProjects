const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

// SQL server configuration
const config = {
  user: 'username',
  password: 'password',
  server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
  database: 'YourDatabaseName',
  
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true // Change to true for local dev / self-signed certs
  }
};

// SELECT endpoint
app.get('/api/select', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM yourTable'); // Modify your query
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE endpoint
app.post('/api/update', async (req, res) => {
  const { id, newValue } = req.body;
  try {
    await sql.connect(config);
    const result = await sql.query`UPDATE yourTable SET column = ${newValue} WHERE id = ${id}`;
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE endpoint
app.post('/api/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await sql.connect(config);
    const result = await sql.query`DELETE FROM yourTable WHERE id = ${id}`;
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Endpoint to upload JSON file
app.post('/upload', upload.single('jsonFile'), async (req, res) => {
    try {
      const fileContent = await fs.readFile(req.file.path, 'utf8');
      const data = JSON.parse(fileContent);
  
      // Connect to your SQL Server
      await sql.connect(config);
  
      // Example of inserting data from JSON file into a table
      for (const item of data) {
        await sql.query`INSERT INTO yourTable (column1, column2) VALUES (${item.column1}, ${item.column2})`;
      }
  
      res.send('JSON file uploaded and data inserted into SQL Server.');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    } finally {
      // Delete the file after processing
      await fs.unlink(req.file.path);
    }
  });

const port = 8600;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
