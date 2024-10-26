/* Coding Steps:

    Create a CRD application (CRUD without update) using json-server or another API
    Use fetch and async/await to interact with the API
    Use a form to create/post new entities
    Build a way for users to delete entities
    Include a way to get entities from the API and display them
    You do NOT need update, but you can add it if you'd like
    Use Bootstrap and/or CSS to style your project */

// Base URL for the API
const API_URL = 'http://localhost:3000/ghostSightings';

// Select DOM elements
const form = document.getElementById('sighting-form');
const sightingList = document.getElementById('sighting-list');

// Fetch and display all ghost sightings
async function fetchSightings() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch ghost sightings');
    
    const sightings = await response.json();
    displaySightings(sightings);
  } catch (error) {
    console.error('Error fetching ghost sightings:', error);
  }
}

// Function to display ghost sightings in the list
function displaySightings(sightings) {
  sightingList.innerHTML = ''; // Clear the list
  sightings.forEach(sighting => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      ${sighting.location} - ${sighting.date} - ${sighting.typeOfGhost}
      <button class="btn btn-outline-danger btn-sm" data-id="${sighting.id}">Delete Entry</button>
    `;
    
    // Add event listener to the delete button
    const deleteButton = li.querySelector('button');
    deleteButton.addEventListener('click', () => {
      const id = deleteButton.getAttribute('data-id');
      deleteSighting(id);
    });

    sightingList.appendChild(li);
  });
}

// Function to create a new entry for ghost sighting
async function createSighting(location, date, typeOfGhost) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, date, typeOfGhost }),
    });
    
    if (!response.ok) throw new Error('Failed to create ghost sighting');
    
    await fetchSightings(); // Refresh the list
  } catch (error) {
    console.error('Error creating ghost sighting:', error);
  }
}

// Function to delete a ghost sighting
async function deleteSighting(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete ghost sighting entry');
    
    console.log(`Ghost sighting with ID ${id} deleted successfully`);
    await fetchSightings(); // Refresh the after deletion
  } catch (error) {
    console.error(`Error deleting ghost sighting with ID ${id}:`, error);
  }
}

//form submission for creating new ghost sighting
form.addEventListener('submit', event => {
  event.preventDefault();
  
 
  const location = document.getElementById('location').value;
  const date = document.getElementById('date').value;
  const typeOfGhost = document.getElementById('typeOfGhost').value;
  
  createSighting(location, date, typeOfGhost);
  
  // Reset the formafter submission
  form.reset();
});

// Fetch and display the ghost sightings when the page loads
fetchSightings();

