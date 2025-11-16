# Legend of Zelda: Breath of the Wild Compendium
An interactive encyclopedia for The Legend of Zelda: Breath of the Wild that allows users to search and browse through all in-game creatures, monsters, materials, equipment, and treasures. Built with vanilla JavaScript and the Hyrule Compendium API.

**Link to project:** https://hyrule-botw-compendium.netlify.app/

![alt tag]()

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, [Hyrule Compendium API](https://gadhagod.github.io/Hyrule-Compendium-API/#/compendium-api)

This project is built using vanilla JavaScript with an object-oriented approach, utilizing four main classes:

- **CompendiumApp**: Orchestrates the entire application and initialises all components.
- **APIService**: Handles all API calls to the Hyrule Compendium API, including data caching to minimize requests.
- **UIController**: Manages all user interactions and coordinates between the API service, search engine, and view layer.
- **CompendiumView**: Handles all DOM manipulation and view state management.

The app fetches data from the Hyrule Compendium API, caches it on first load for better performance, and provides three main ways to explore content:
1. Browse by category (creatures, monsters, materials, equipment, treasure)
2. Search for specific items by name
3. Click through category entry lists to view detailed information

Each entry displays the item's name, category, description, image, and common locations found in the game.

## Optimizations

The APIService class implements data caching - when the app first loads, it fetches all compendium data once and stores it locally. This eliminates redundant API calls and significantly improves search performance since the data is already available in memory.

The architecture uses separation of concerns with distinct classes handling specific responsibilities (API calls, search logic, UI updates, and view rendering), making the code more maintainable and testable. Event delegation and proper state management ensure smooth transitions between different views (categories, entry lists, and single entries).

The app also includes Jest unit tests to ensure reliability of core functionality.

### Future Improvements

The hope is to have the search functionality be more towards fuzzy matching, or show options while the user is typing...rather than ONLY exact matching (which it is currently using). This would require using a library like RxJS and using something like switchMap for the search.

Use another API get access to recipes used in the game and the edible items in the game.

## Lessons Learned:

The project reinforced the importance of planning class architecture before diving into code. Implementing the separation of concerns pattern made debugging easier - when something went wrong with the UI, I knew exactly which class to check.

Refactoring was where I think I learned the most. Getting it built first then pulling reusable functions, eliminating unnecessary classes in favour of helper functions, and separating out bloated classes into new classes or more helper functions taught me a lot about how to better plan for a project next time. 
I learned an approach to classes is that a class is made up of behaviour and state. Without both of those, it's not really a class.

Working with a third-party API taught me the value of caching data and handling edge cases like missing location data (using optional chaining with `resultData?.common_locations`). 

I found writing tests to be challenging. I see where test-driven development is useful - to write the desired behaviour, fail the test, then fix the test. Writing the functions/methods first then the tests is a bit more challenging. I have to ask, is this a problem with the test, the test set-up, or my code itself.
Building this project without a framework challenged me to really understand DOM manipulation, event handling, and state management at a fundamental level, which has made me more confident in working with any JavaScript framework.

