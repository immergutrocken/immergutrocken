describe('frontend', () => {
    it('sollen artikel angelegt und angezeigt werden können', () => {
        cy.visit(Cypress.env('sanityBaseUrl'));

        cy.get('.sanity-app-loading-screen').should('not.exist');
        cy.get('select').should('have.value', 'development');

        cy.get('[data-testid="default-layout-global-create-button"]').click();
        cy.get('a[data-testid="create-document-item-article"]').click();

        cy.get('span').contains('Loading document').should('be.visible');
        cy.get('span').contains('Loading document').should('not.be.visible');

        cy.get('[data-testid="input-title"] input').type('Hello!');

    });
})
