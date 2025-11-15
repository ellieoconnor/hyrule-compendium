module.exports = {
    testEnvironment: 'jsdom',
    testMatch: ['**/*.spec.js', '**/*.test.js'],
    collectCoverageFrom: [
        'hyrule-compendium/js/**/*.js',
        '!hyrule-compendium/js/**/*.spec.js',
        '!hyrule-compendium/js/**/*.test.js'
    ],
    coverageDirectory: 'coverage',
    verbose: true
};