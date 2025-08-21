describe('Registers Admin', () => {
  beforeEach(() => {
    // Usar cy.session() para login - será cacheado automaticamente
    cy.loginAdmin()
    
    // Navegar para dashboard após login
    cy.visit('/admin')
    cy.get('.icon-box', { timeout: 10000 }).click()
  })

  it('should be able to register a new Turma', () => {
    cy.get('a[href="/admin/resources/Turma"]').click()
    cy.get('a[href="/admin/resources/Turma/actions/new"]').contains('Create new').click()
    cy.get('#nome').type('Turma de Teste')
    
    cy.intercept('POST', '/admin/api/resources/Turma/actions/new').as('createTurma')
    cy.get('[data-testid="button-save"]').contains('Save').click()
    
    cy.wait('@createTurma').its('response.statusCode').should('eq', 200)
  })

  it('should be able to register a new Responsavel', () => {
    cy.get('a[href="/admin/resources/Responsavel"]').click()
    cy.get('a[href="/admin/resources/Responsavel/actions/new"]').contains('Create new').click()
    cy.get('#email').type('email@teste.com')
    cy.get('#nome').type('Responsavel de Teste')
    cy.get('#contato').type('123456789')
    cy.get('#senhaHash').type('senha123', { log: false })
    
    cy.intercept('POST', '/admin/api/resources/Responsavel/actions/new').as('createResponsavel')
    cy.get('[data-testid="button-save"]').contains('Save').click()
    
    cy.wait('@createResponsavel').its('response.statusCode').should('eq', 200)
  })

  it('should be able to register a new Crianca', () => {
    cy.get('a[href="/admin/resources/Crianca"]').click()
    cy.get('a[href="/admin/resources/Crianca/actions/new"]').contains('Create new').click()
    cy.get('#nome').type('Crianca de Teste')
    cy.get('#dataNascimento').type('2023-08-08')
    
    cy.get('[data-testid="property-edit-turma"] .adminjs_Select')
      .click().first().click({ force: true })
    cy.get('[class$="option"]').first().click({ force: true })
    
    cy.get('[data-testid="property-edit-responsavel"] .adminjs_Select')
      .click().first().click({ force: true })
    cy.get('[class$="option"]').first().click({ force: true })
    
    cy.intercept('POST', '/admin/api/resources/Crianca/actions/new').as('createCrianca')
    cy.get('[data-testid="button-save"]').contains('Save').click()
    
    cy.wait('@createCrianca').its('response.statusCode').should('eq', 200)
  })

  it('should be able to register a new Admin', () => {
    cy.get('a[href="/admin/resources/Admin"]').click();
    cy.get('a[href="/admin/resources/Admin/actions/new"]').contains('Create new').click()
    cy.get('#usuario').type('userteste')
    cy.get('#senhaHash').type('senha123', { log: false })
    cy.get('#nome').type('User de Teste')
    
    cy.intercept('POST', '/admin/api/resources/Admin/actions/new').as('createAdmin')
    cy.get('[data-testid="button-save"]').contains('Save').click()
    
    cy.wait('@createAdmin').its('response.statusCode').should('eq', 200)
  })
})