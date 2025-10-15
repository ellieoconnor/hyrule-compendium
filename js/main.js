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
        this.uiController.displayCategories();
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
    // receives search term and the data from APIService
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

        // Category click
        document.querySelectorAll("img.category-badge").addEventListener('click', () => {

        })
    };

    displayCategories(xyz) {
        // display categories in the DOM
    }

    // Display single entry view
    displaySingleEntry(resultData) {
        let itemName = null;
        let itemCategory;
        let itemDescription;
        let itemImage = null;

        // Remove the 'hidden' class for a visible entry card
        let entrySection = document.querySelector('.results');
        entrySection.classList.remove('hidden');

        itemName = document.getElementById('item-name').innerHTML = resultData.name;
        itemCategory = document.getElementById('item-category').innerHTML = resultData.category;
        itemDescription = document.getElementById('item-description').innerHTML = resultData.description;
        itemImage = document.getElementById('item-image').src = resultData.image;
    }

    hideSingleEntry() {
        document.querySelector('.results').classList.add('hidden');
    }

    displayCategoryList(category) {
        this.hideSingleEntry(); // Hide the entry card
        // another method that goes through entries and gets each catetory
        // display at the top
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

class CategoryController {
    /**
     * Gets the categories
     */
}

class ItemDetailController { }

class ModalController { }

class SearchResultsController { }

// Create an instance of the compendium app
const compendiumApp = new CompendiumApp();

/**Todo List:
Phase 1: CORE FUNCTIONALITY (PRIORITY ORDER)
    1. Display categories on page load
        - Show all 5 category buttons (creatures, equipment, materials, monsters, treasure)
        - Make them clickable
    2. Category click -> Entry list view
        - Show all entries in that category
        - Display as grid/list of clickable items
        - Add "Back to Categories" button
    3. Entry list click -> Single Entry Detail
        - Show the full entry card
        - Add back button that returns to entry list
    4. Search: Exact Match with Related Entries
        - If exact match found: show entry + card + related entries section
        - Related = same category + contains search term
        - Only show related section if matches exist
    5. Search: Partial matches (no exact match)
        - Show list of all entries that contain the search term
        - Display as clickable list
    6. Search: No results message
        - Show friendly message when no matches found
    7. Empty search behaviour
        - Do nothing, keep categories visible
    8. Back button navigation logic
        - Track where user came from (category list vs search)
        - Return to appropriate view
PHASE 2: ENHANCEMENTS (OPTIONAL):
    1. Fuzzy matching 
        - "mogoblin" -> "moblin"
    2. CSS refactoring
        - Clean up and organise styles
*/

/* 
1. Display categories on page load
2. Category -> entry list view
3. Search: partial matches + results list
4. Search: no results message
5. Back button navigation
6. Fuzzy matching
7. CSS refactoring
*/