describe('Login Admin', () => {

  it('should be able to login with valid credentials', () => {
    cy.loginAdmin()
  })

  it('should appear error message: Wrong email and/or password', () => {
    cy.visit('/admin/login')
    cy.get('[name="email"]').click().type('superuser')
    cy.get('[name="password"]').click().type(`senha123`)
    cy.get('.adminjs_Button').contains('Login').click()
    cy.get('.adminjs_MessageBox .adminjs_Text:first-child').contains('Wrong email and/or password')
  })
})