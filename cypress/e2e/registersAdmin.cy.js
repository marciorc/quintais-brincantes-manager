describe('Registers Admin', () => {
  const password = Cypress.env('SUPERUSER_PASSWORD');

  beforeEach(() => {
    cy.visit('/admin/login')
    cy.get('[name="email"]').click().type('superuser')
    cy.get('[name="password"]').click().type(`${password}`)
    cy.get('.adminjs_Button').contains('Login').click()
    cy.get('.adminjs_Header.adminjs_H2').contains('Welcome on Board')
  })

  it('should be able to register a new Turma', () => {
    cy.get('.icon-box').click()
    cy.navigateToCreate('Turma')
    cy.get('#nome').click().type('Turma de Teste')
    cy.saveForm()
  })

  it('should be able to register a new Responsavel', () => {
    cy.get('.icon-box').click()
    cy.navigateToCreate('Responsavel')
    cy.get('#email').click().type('email@teste.com')
    cy.get('#nome').click().type('Responsavel de Teste')
    cy.get('#contato').click().type('123456789')
    cy.get('#senhaHash').click().type('senha123')
    cy.saveForm()
  })

  it('should be able to register a new Crianca', () => {
    cy.get('.icon-box').click()
    cy.navigateToCreate('Crianca')
    cy.get('#nome').click().type('Crianca de Teste')
    cy.get('#dataNascimento').click().type('01/01/2020')
    cy.get('[data-testid="property-edit-turma"] .adminjs_Select').click().type('1')
    cy.get('[data-testid="property-edit-responsavel"] .adminjs_Select').click().type('1')
    cy.saveForm()
  })

  it('should be able to register a new admin', () => {
    cy.get('.icon-box').click()
    cy.navigateToCreate('Admin')
    cy.get('#usuario').click().type('User Test')
    cy.get('#senhaHash').click().type('senha123')
    cy.get('#nome').click().type('User Test')
    cy.saveForm()
  })
})