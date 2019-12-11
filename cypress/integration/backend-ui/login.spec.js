/**
 * @Author: Sam
 * @Date: 2019/12/9
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test login page of the backend ui', () => {
  before(() => {
    // Get token
    let token = null
    cy.request(`${apiBaseUrl}/token/admin`)
      .its('body')
      .then((res) => {
        expect(res.code).to.equal(0)
        expect(res.message).to.equal('Successfully login, use your token')
        token = res.token

        // Reset users
        cy.request(`${apiBaseUrl}/user`)
          .its('body')
          .then((res) => {
            expect(res.code).to.equal(0)
            res.data.forEach((user) => {
              cy.request('DELETE', `${apiBaseUrl}/user/${user._id}`)
            })
          })

        cy.fixture("users").then(users => {
          let [u1, u2, u3, u4, ...rest] = users
          let four = [u1, u2, u3, u4]
          four.forEach(user => {
            cy.request('POST', `${apiBaseUrl}/user`, user)
          })
        })
      })
  })
  beforeEach(() => {
    cy.visit(url)
  })
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.vue-title')
          .should('contain', 'Login')
      })
    })
    describe('Login table', () => {
      it('shows a login table with 2 input boxes, 1 button and 6 3rd party oauth2 login buttons', () => {
        let loginTable = cy.get('.login-table')
        loginTable.should('contain', 'Username')
        loginTable.should('contain', 'Password')
        loginTable.should('contain', 'Login')
        loginTable.should('contain', 'OtherLogin')
        loginTable.get('.icon-wrapper')
          .find('.icon')
          .should('have.length', 6)
      })
    })
  })
  describe('Function', () => {
    describe('Login', () => {
      it('logins successfully', () => {
        cy.get('.login-table')
          .get('.username')
          .type('admin')
        cy.get('.login-table')
          .get('.password')
          .type('admin')
        cy.get('.login-table')
          .get('.submit')
          .click()
        cy.screenshot('backend-login-success')
        cy.wait(5000)
        cy.url()
          .should('contain', '/admin')
        cy.get('.index')
          .get('.content-wrapper')
          .get('.vue-title')
          .should('contain', 'Welcome to the Backend of Take-Away App!')
      })
    })
  })
})
