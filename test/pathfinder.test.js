let expect;

// Use an async IIFE (Immediately Invoked Function Expression) to import chai
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

describe('Otitoh to Jita', function() {
  let dijkstra, systems;

  before(async function() {
    // Dynamically import the dijkstra function and the JSON data
    dijkstra = (await import('../src/Pathfinder.js')).dijkstra;
    systems = (await import('../src/EveSystemsTheForge.json', { assert: {type: 'json' } })).default;
  });


  it('should find the shortest path in the system', async function() {
    // Replace 'StartSystem' and 'EndSystem' with actual system names from your JSON
    // Example test - replace 'StartSystem' and 'EndSystem' with actual system names from your JSON
    const start = 'Otitoh'; // Replace with an actual start system name from your JSON
    const goal = 'Jita'; // Replace with an actual end system name from your JSON
    const speed = 2; // Example speed
    const ignoreLowSecurity = true;
    const ignoredSystems = [];

    const result = dijkstra(systems, start, goal, speed, ignoreLowSecurity, ignoredSystems);

    // The expected result should be based on the actual data in your JSON
    // Replace the expected path and totalTime with what is expected based on your JSON data

    expect(result).to.deep.equal({ 
      path: [
        'Otitoh', 'Friggi', 'Airmia', 
        'Ishisomo', 'Olo', 'Obanen', 
        'Poinen', 'Josameto', 'New Caldari', 
        'Jita'
      ], 
      totalTime: 4.5
    });
    });
  });
    describe('Abagawa to Jita', function() {
      let dijkstra, systems;

      before(async function() {
        // Dynamically import the dijkstra function and the JSON data
        dijkstra = (await import('../src/Pathfinder.js')).dijkstra;
        systems = (await import('../src/EveSystemsTheForge.json', { assert: {type: 'json' } })).default;
      });

    it('should find the shortest path in the system', async function() {
      // Replace 'StartSystem' and 'EndSystem' with actual system names from your JSON
      // Example test - replace 'StartSystem' and 'EndSystem' with actual system names from your JSON
      const start = 'Abagawa'; // Replace with an actual start system name from your JSON
      const goal = 'Jita'; // Replace with an actual end system name from your JSON
      const speed = 1; // Example speed
      const ignoreLowSecurity = true;
      const ignoredSystems = [];
  
      const result = dijkstra(systems, start, goal, speed, ignoreLowSecurity, ignoredSystems);
  
      // The expected result should be based on the actual data in your JSON
      // Replace the expected path and totalTime with what is expected based on your JSON data
  
      expect(result).to.deep.equal({ 
        path: [
          'Abagawa', 'Saisio', 'Nomaa', 
          'Poinen', 'Josameto', 'New Caldari',  
          'Jita'
        ], 
        totalTime: 6
      });
      });
    });
      describe('Paala to Jita', function() {
        let dijkstra, systems;

        before(async function() {
          // Dynamically import the dijkstra function and the JSON data
          dijkstra = (await import('../src/Pathfinder.js')).dijkstra;
          systems = (await import('../src/EveSystemsTheForge.json', { assert: {type: 'json' } })).default;
        });

      it('should find the shortest path in the system', async function() {
        // Replace 'StartSystem' and 'EndSystem' with actual system names from your JSON
        // Example test - replace 'StartSystem' and 'EndSystem' with actual system names from your JSON
        const start = 'Paala'; // Replace with an actual start system name from your JSON
        const goal = 'Jita'; // Replace with an actual end system name from your JSON
        const speed = 1; // Example speed
        const ignoreLowSecurity = false;
        const ignoredSystems = [];
    
        const result = dijkstra(systems, start, goal, speed, ignoreLowSecurity, ignoredSystems);
    
        // The expected result should be based on the actual data in your JSON
        // Replace the expected path and totalTime with what is expected based on your JSON data
    
        expect(result).to.deep.equal({ 
          path: [
            'Paala', 'Uemon', 'Otosela', 
            'Tasti', 'Messoya', 'Akora', 
            'Oijanen', 'Airaken', 'Korsiki', 
            'Osmon', 'Olo', 'Obanen', 
            'Poinen', 'Josameto', 'New Caldari', 
            'Jita'
          ], 
          totalTime: 15
        });
        });
});

describe('Paala to Jita but with error', function() {
  let dijkstra, systems;

  before(async function() {
    // Dynamically import the dijkstra function and the JSON data
    dijkstra = (await import('../src/Pathfinder.js')).dijkstra;
    systems = (await import('../src/EveSystemsTheForge.json', { assert: {type: 'json' } })).default;
  });

it('should find the shortest path in the system', async function() {
  // Replace 'StartSystem' and 'EndSystem' with actual system names from your JSON
  // Example test - replace 'StartSystem' and 'EndSystem' with actual system names from your JSON
  const start = 'Paala'; // Replace with an actual start system name from your JSON
  const goal = 'Jita'; // Replace with an actual end system name from your JSON
  const speed = 1; // Example speed
  const ignoreLowSecurity = true;
  const ignoredSystems = [];

  const result = dijkstra(systems, start, goal, speed, ignoreLowSecurity, ignoredSystems);

  // The expected result should be based on the actual data in your JSON
  // Replace the expected path and totalTime with what is expected based on your JSON data

  expect(result).to.deep.equal({
    path: null,
    totalTime: null,
    message: 'No valid route found under the given constraints.'
  });
  });

// Add more tests as needed
});
