// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

beforeEach(() => {
    cy.session("sanity", () => {
        cy.visit(Cypress.env('sanityBaseUrl'));
        cy.get('button').contains('E-mail / password').click();

        cy.intercept('https://05hvmwlk.api.sanity.io/*/users/me*').as('login');
        cy.origin('https://accounts.sanity.io', () => {
            cy.get('input[name="email"]').type(Cypress.env('sanityUser'));
            cy.get('input[type="password"]').type(Cypress.env('sanityPassword'));
            cy.get('button').contains('Sign in').click();
            cy.wait('@login').its('response.statusCode').should('eq', 200);
        });
    }, {
        cacheAcrossSpecs: true,
        validate: () => {
            cy.getCookie('sanitySession', { domain: '05hvmwlk.api.sanity.io' }).should('exist');
        },
    });
});
