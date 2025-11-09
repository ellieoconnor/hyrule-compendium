/**
 * Orchestrates everything and handles intial setup
 */
class CompendiumApp {
    // Creates instances of the other classes...sets up the application and it's properties and methods
    constructor() {
        this.apiService = new APIService();
        this.searchEngineClass = new SearchEngine();
        this.compendiumEntryClass = new CompendiumEntry(this.apiService);
        this.uiController = new UIController(this.apiService, this.searchEngineClass, this.compendiumEntryClass);

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
                return this.compendiumData;
            })
            .catch(err => {
                console.error(`Error: ${err}`);
                throw err;
            })
    }

    /**
     * Get api data specifically from category endpoint
     * @param {category} category 
     * @returns categoryData
     */
    getCategoryData(category) {
        const url = `https://botw-compendium.herokuapp.com/api/v3/compendium/category/${category}`;
        return fetch(url)
            .then(response => response.json())
            .then(apiResponse => {
                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.message);
                }

                const categoryData = apiResponse.data;
                console.log('From category fetch:', categoryData);
                return categoryData; // DON'T FORGET TO RETURN THE ACTUAL DATA!!
            })
            .catch(err => {
                console.error(`Error: ${err}`);
                throw err;
            });
    }

    /**
     * Get api data for a single item
     */
    getItemData(itemName) {
        const url = `https://botw-compendium.herokuapp.com/api/v3/compendium/entry/${itemName}`;
        return fetch(url)
            .then(response => response.json())
            .then(apiResponse => {
                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.message);
                }

                const entryItemData = apiResponse.data;
                console.log('From getItemData', entryItemData);
                return entryItemData;
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
    constructor(apiService, searchEngineClass, compendiumEntryClass) { // receive the class passed in the CompendiumApp constructor
        this.apiService = apiService; // Store it in this class to be used.
        this.searchEngineClass = searchEngineClass;
        this.compendiumEntryClass = compendiumEntryClass;
    }

    // Listens for search button clicks/enter key
    setupEventListeners() {

        this.setupSearchListener();
        this.setupCategoryListeners();
    };

    setupSearchListener() {
        document.querySelector('button').addEventListener('click', () => this.handleSearchClick());
    }

    setupCategoryListeners() {
        document.querySelectorAll("img.category-badge").forEach(badge => {
            badge.addEventListener('click', () => {
                const badgeCategory = badge.id
                this.handleCategoryClick(badgeCategory);
            });
        })
    }

    // For search
    handleSearchClick() {
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
    }

    // For category clicks
    handleCategoryClick(badgeCategory) {
        this.apiService.getCategoryData(badgeCategory).then(categoryEntries => {
            this.displayCategoryList(badgeCategory, categoryEntries)
        });
    }

    // For entry list click
    handleEntryItemClick(itemName) {
        console.log('handleEntryItemClick');
        // call api for item search
        this.apiService.getItemData(itemName).then(itemEntry => {
            if (itemEntry) {
                this.hideItemListView();
                this.displaySingleEntry(itemEntry);
            }
        })
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

    hideItemListView() {
        const entryListSection = document.querySelector('.entry-list-section');
        entryListSection.classList.add('hidden');
    }

    /**
     * Display the list of categories after a click on a category
     * @param {} categoryTitle
     * @param {*} categoryList
     */
    displayCategoryList(categoryTitle, categoryList) {
        this.hideSingleEntry(); // Hide the entry card

        const entryListSection = document.querySelector('.entry-list-section');

        entryListSection.classList.remove('hidden');

        // update category name
        document.getElementById('category-title').innerHTML = categoryTitle;

        let listOfNames = this.compendiumEntryClass.createArrayOfItemNames(categoryList)
        let list = document.getElementById("entry-list-grid-results");

        if (list.hasChildNodes()) {
            console.log('remove!')
            list.innerHTML = '';
        }

        // loop through the entries and create clickable links
        for (let i = 0; i < listOfNames.length; ++i) {
            let li = document.createElement('li');
            li.innerText = listOfNames[i];
            li.setAttribute('data-original-name', categoryList[i].name);
            li.addEventListener('click', () => {
                const itemName = li.getAttribute('data-original-name')
                this.handleEntryItemClick(itemName);
            })
            list.appendChild(li);
        }
    }
}
// Gets search term from input field
// Displays results in the DOM
// Shows "no results" message when needed.

class CompendiumEntry {
    // helper method? to loop through categories
    createArrayOfItemNames(items) {
        let listOfItemNames = items.map(entry => {
            return entry.name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
        });

        return listOfItemNames;
    }
}

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
// Only run in browser, not during testing
if (typeof module === 'undefined' || !module.exports) {
    const compendiumApp = new CompendiumApp();
}

// For testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CompendiumApp,
        APIService,
        SearchEngine,
        UIController,
        CompendiumEntry
    };
}

/**Todo List:
Phase 1: CORE FUNCTIONALITY (PRIORITY ORDER)
    1. ✅ Display categories on page load
        - ✅ Show all 5 category buttons (creatures, equipment, materials, monsters, treasure)
        - ✅ Make them clickable
    2. Category click -> Entry list view
        - ✅ Show all entries in that category
        - ✅ Display as grid/list of clickable items
        - ✅ Add "Back to Categories" button
    3. Entry list click -> Single Entry Detail
        - ✅ Show the full entry card
        - ✅ Show new items when a new category is clicked
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