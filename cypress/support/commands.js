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

// Comando para login no AdminJS
// Alternativa se não quiser instalar uuid
Cypress.Commands.add('loginAdmin', () => {
  const email = 'superuser'
  const password = Cypress.env('SUPERUSER_PASSWORD')
  const timestamp = Date.now()
  
  cy.session(`admin-${timestamp}`, () => {
    cy.log(`Criando nova sessão com timestamp: ${timestamp}`)
    
    cy.visit('/admin/login')
    
    cy.get('[name="email"]').type(email)
    cy.get('[name="password"]').type(password, { log: false })
    cy.get('.adminjs_Button').contains('Login').click()
    
    cy.get('.adminjs_Header.adminjs_H2', { timeout: 10000 })
      .contains('Welcome on Board')
      .should('be.visible')
  })
})

// Comando para navegar para recurso e criar novo
Cypress.Commands.add('navigateToCreate', (resourceName) => {
  cy.get(`a[href="/admin/resources/${resourceName}"]`).click()
  cy.get(`a[href="/admin/resources/${resourceName}/actions/new"]`).contains('Create new').click()
})

// Comando para salvar formulário
Cypress.Commands.add('saveForm', () => {
  cy.intercept('POST', '/admin/api/resources/**/actions/new').as('saveRequest')
  cy.get('[data-testid="button-save"]').contains('Save').click()
  cy.wait('@saveRequest').its('response.statusCode').should('eq', 200)
})