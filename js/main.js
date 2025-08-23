/**
 * Orchestrates everything and handles intial setup
 */
class CompendiumApp {
  // Creates instances of the other classes...sets up the application and it's properties and methods
  constructor() {
    this.apiService = new APIService();
    this.SearchEngine = new SearchEngine();
    this.uiController = new UIController(this.apiService);

    // Event listeners in the UI
    this.uiController.setupEventListeners();
  }
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
        console.log('From getAllData:', this.compendiumData);
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
  searchData(searchTerm, allData) {
    if (searchTerm.trim() === '') {
      // return all data sorted alphabetically 
      // const alphaSortedData = sortAlphabetically(allData);
      // return alphaSortedData;
      console.log('From searchData:', allData);
      return allData;
    }
  }
  // Filters for exact matches first, then partial matches
  // Sorts results alphabetically
  // Returns the filtered/sorted results
}

/**
 * Coordinates with other controllers to update the DOM
 */
class UIController {
  // constructor to set up the class and it's properties and methods
  constructor(apiService) { // receive the class passed in the CompendiumApp constructor
    this.apiService = apiService; // Store it in this class to be used.
  }
  // Listens for search button clicks/enter key
  setupEventListeners() {
    document.querySelector('button').addEventListener('click', () => {
      const allData = this.apiService.getAllData();
    });
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

// Create an instance of the compendium app
const compendiumApp = new CompendiumApp();

/**Todo List:
1. Search query
  - Exact Match
  - Results List
  - On first search fetch all the data
2. Category List
3. Click Category and list results
*/