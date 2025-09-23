/**
 * Orchestrates everything and handles intial setup
 */
class CompendiumApp {
  // Creates instances of the other classes...sets up the application and it's properties and methods
  constructor() {
    this.apiService = new APIService();
    this.searchEngineClass = new SearchEngine();
    this.uiController = new UIController(this.apiService, this.searchEngineClass);

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
    this.getAllData(); // Get all data at page load
  }

  getAllData() {
    if (this.compendiumData !== null) { // if empty run the below code
      return Promise.resolve(this.compendiumData);
    }

    const url = `https://botw-compendium.herokuapp.com/api/v3/compendium`;
    return fetch(url)
      .then(response => response.json()) // parse response as JSON
      .then(apiResponse => {
        if (apiResponse.status !== 200) {
          throw new Error(apiResponse.message);
        }

        this.compendiumData = apiResponse.data;
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
  searchData(searchTerm, entries) {
    if (searchTerm.trim() === '') {
      // return all data sorted alphabetically 
      return this.sortEntriesAlphabetically(entries);
      // console.log('From searchData:', this.sortResultsAlphabetically(allData));
    }
    return this.findExactMatch(searchTerm, entries);
  };

  // Filters for exact matches first, then partial matches
  findExactMatch(input, compendiumEntries) {
    return compendiumEntries.find((entry) => {
      return input.toLowerCase() === entry.name;
    });
  };

  // Sorts results alphabetically
  sortEntriesAlphabetically(entries) {
    // parameters: data results from empty search
    // return: data results sorted alphabetically by name
    // pseudo code:
    return entries.sort((a, b) => a.name.localeCompare(b.name));
  };

  // Returns the filtered/sorted results
}

/**
 * Coordinates with other controllers to update the DOM.
 */
class UIController {
  // constructor to set up the class and it's properties and methods
  constructor(apiService, searchEngineClass) { // receive the class passed in the CompendiumApp constructor
    this.apiService = apiService; // Store it in this class to be used.
    this.searchEngineClass = searchEngineClass;
  }

  // Listens for search button clicks/enter key
  setupEventListeners() {
    // Search button click
    document.querySelector('button').addEventListener('click', () => {
      // store search term from input
      const searchTerm = document.querySelector('input').value;


      this.apiService.getAllData().then(compendiumEntries => {
        const result = this.searchEngineClass.searchData(searchTerm, compendiumEntries);

        // UI Controller decides what to display
        if (result) {
          this.displaySingleEntry(result);
        }
        // else {
        //   this.showNoResults();
        // }
      });
    });
  };

  // Display single entry view
  displaySingleEntry(resultData) {
    let itemName = null;
    let itemCategory;
    let itemDescription;
    let itemImage = null;

    itemName = document.getElementById('item-name').innerHTML = resultData.name;
    itemCategory = document.getElementById('item-category').innerHTML = resultData.category;
    itemDescription = document.getElementById('item-description').innerHTML = resultData.description;
    itemImage = document.getElementById('item-image').src = resultData.image;
  }
}
// Gets search term from input field
// Displays results in the DOM
// Shows "no results" message when needed.

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