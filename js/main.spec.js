const { SearchEngine } = require('./main');

describe('SearchEngine', () => {
    let searchEngine;

    beforeEach(() => {
        searchEngine = new SearchEngine();
    });

    describe('sortEntriesAlphabetically', () => {
        it('should sort entries alphabetically', () => {
            const entries = [
                { name: 'zelda' },
                { name: 'link' },
                { name: 'mipha' }
            ];

            const sortedResults = searchEngine.sortEntriesAlphabetically(entries);

            expect(sortedResults[0].name).toBe('link');
            expect(sortedResults[1].name).toBe('mipha');
            expect(sortedResults[2].name).toBe('zelda');
        });
    });

    describe('searchData', () => {
        it('should return the matching entry', () => {
            // Arrange
            const entries = [
                { name: 'zelda' },
                { name: 'link' },
                { name: 'mipha' }
            ];

            // Act
            const result = searchEngine.searchData('link', entries);

            // Assert
            expect(result.name).toBe('link');
        })
    })
})