describe('Login Admin', () => {

  const password = Cypress.env('SUPERUSER_PASSWORD');

  beforeEach(() => {
    cy.visit('/admin/login')
  })

  it('should be able to login with valid credentials', () => {
    cy.get('[name="email"]').click().type('superuser')
    cy.get('[name="password"]').click().type(`${password}`)
    cy.get('.adminjs_Button').contains('Login').click()
    cy.get('.adminjs_Header.adminjs_H2').contains('Welcome on Board')
  })

  it('should appear error message: Wrong email and/or password', () => {
    cy.get('[name="email"]').click().type('superuser')
    cy.get('[name="password"]').click().type(`senha123`)
    cy.get('.adminjs_Button').contains('Login').click()
    cy.get('.adminjs_MessageBox .adminjs_Text:first-child').contains('Wrong email and/or password')
  })
})