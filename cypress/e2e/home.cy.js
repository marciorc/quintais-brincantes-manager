describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')
    cy.get('h1').contains('Bem-vindo ao Quintal Brincante')
    cy.get('h2').contains('O que são Quintais Brincantes?')
    cy.get('h2').contains('Nossa Filosofia')
    cy.get('h2').contains('Benefícios dos Quintais Brincantes')
  })
})