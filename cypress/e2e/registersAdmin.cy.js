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
    cy.get('a[href="/admin/resources/Turma"]').click()
    cy.get('a[href="/admin/resources/Turma/actions/new"]').contains('Create new').click()
    cy.get('#nome').click().type('Turma de Teste')
    cy.get('[data-testid="button-save"]').click()
  })

  it('should be able to register a new Responsavel', () => {
    cy.get('.icon-box').click()
    cy.get('a[href="/admin/resources/Responsavel"]').click()
    cy.get('a[href="/admin/resources/Responsavel/actions/new"]').contains('Create new').click()
    cy.get('#email').click().type('email@teste.com')
    cy.get('#nome').click().type('Responsavel de Teste')
    cy.get('#contato').click().type('123456789')
    cy.get('#senhaHash').click().type('senha123')
    cy.get('[data-testid="button-save"]').click()
  })

  it('should be able to register a new admin', () => {
    cy.get('.icon-box').click()
    cy.get('a[href="/admin/resources/Admin"]').click()
    cy.get('a[href="/admin/resources/Admin/actions/new"]').contains('Create new').click()
    cy.get('#usuario').click().type('User Test')
    cy.get('#senhaHash').click().type('senha123')
    cy.get('#nome').click().type('User Test')
    cy.get('[data-testid="button-save"]').click()
  })
})