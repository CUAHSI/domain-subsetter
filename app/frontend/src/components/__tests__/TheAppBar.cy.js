import TheAppBar from '../TheAppBar.vue'

describe('TheAppBar', () => {
  it('playground', () => {
    cy.mount(TheAppBar, { props: { msg: 'Hello Cypress' } })
  })

  it('renders properly', () => {
    cy.mount(TheAppBar, { props: { msg: 'Hello Cypress' } })
    cy.get('h1').should('contain', 'Hello Cypress')
  })
})
