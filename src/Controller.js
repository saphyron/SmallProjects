// Example using fetch in React to call an API endpoint

// SELECT example
fetch('/api/select')
  .then(response => response.json())
  .then(data => console.log(data));

// UPDATE example
fetch('/api/update', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 1,
    newValue: 'some new value',
  }),
});

// DELETE example
fetch('/api/delete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 1,
  }),
});
