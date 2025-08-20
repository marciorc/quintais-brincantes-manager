// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// Comando para navegar para recurso e criar novo
Cypress.Commands.add('navigateToCreate', (resourceName) => {
  cy.get(`a[href="/admin/resources/${resourceName}"]`).click();
  cy.get(`a[href="/admin/resources/${resourceName}/actions/new"]`).contains('Create new').click();
});

// Comando para salvar formulário e verificar sucesso
Cypress.Commands.add('saveForm', () => {
  cy.intercept('POST', '/admin/api/resources/**/actions/new').as('saveRequest');
  cy.get('[data-testid="button-save"]').contains('Save').click();
  cy.wait('@saveRequest').its('response.statusCode').should('eq', 200);
});