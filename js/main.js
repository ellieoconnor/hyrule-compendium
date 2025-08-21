//Example fetch using pokemonapi.co
document.querySelector('button').addEventListener('click', getFetch)

function getFetch() {
  const choice = document.querySelector('input').value
  // const url = `https://botw-compendium.herokuapp.com/api/v3/compendium/entry/${choice}`
  const url = `https://botw-compendium.herokuapp.com/api/v3/compendium`
  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      document.querySelector('h2').innerText = data.data?.name;
      document.querySelector('img').src = data.data?.image;
      document.getElementById('description').innerText = data.data?.description;
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

/**
 * Orchestrates everything and handles intial setup
 */
class CompendiumApp {
  // Creates instances of the other classes
  // Coordinates the search flow (UIController -> APIService -> SearchEngine -> UIController)
}

/**
 * Fetches all compendium data once and stores it.
 */
class APIService {
  // has a method to fetch all data (called on first search)
  // stores data internally
  // provides a way for other classes to access the stored data.
  constructor() {
    this.compendiumData = null; // start with no data
  }

  getAllData() {
    if (this.compendiumData !== null) {
      return Promise.resolve(this.compendiumData);
    }

    const url = `https://botw-compendium.herokuapp.com/api/v3/compendium`;
    fetch(url)
      .then(response => response.json()) // parse response as JSON
      .then(data => {
        this.compendiumData = data;
        return this.compendiumData;
      })
      .catch(err => {
        console.error(`Error: ${err}`);
        throw err;
      })
  }
}

/**
 * Takes search input, finds matches (including fuzzy matching), returns sorted results
 */
class SearchEngine {
  // recieves search term and the data from APIService
  // Filters for exact matches first, then partial matches
  // Sorts results alphabetically
  // Returns the filtered/sorted results
}

/**
 * Coordinates with other controllers to update the DOM
 */
class UIController {
  // Listens for search button clicks/enter key
  searchData() {
    document.querySelector('button').addEventListener('click', getAllData);
  }
  // Gets search term from input field
  // Displays results in the DOM
  // Shows "no results" message when needed.
}

class CompendiumEntry { }

/**
 * Tracks current view, previous view, navigation stack
 */
class AppStateManager { }

/**
 * Handles all view transitions and back button logic
 */
class NavigationController { }

class CategoryController { }

class ItemDetailController { }

class ModalController { }

class SearchResultsController { }



/**Todo List:
1. Search query
  - Exact Match
  - Results List
  - On first search fetch all the data
2. Category List
3. Click Category and list results
*/