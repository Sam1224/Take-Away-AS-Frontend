/**
 * @Author: Sam
 * @Date: 2019/12/9
 * @Version: 1.0
 **/
/* eslint-disable */
let url = 'http://localhost:8080/#/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test add user page of the backend ui', () => {
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
    cy.get('.login-table')
      .get('.username')
      .type('admin')
    cy.get('.login-table')
      .get('.password')
      .type('admin')
    cy.get('.login-table')
      .get('.submit')
      .click()
    cy.wait(5000)
    cy.get('.home')
      .get('.nav-wrapper')
      .find('.nav-item')
      .eq(1)
      .click()
    cy.wait(5000)
    cy.get('.userslist-wrapper')
      .get('.users-table')
      .get('.tab-wrapper')
      .get('.tab-item')
      .get('.add')
      .click()
  })
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.add-wrapper')
          .get('.title')
          .should('contain', 'Add User')
      })
    })
    describe('User form', () => {
      it('shows a user form with 3 input boxes and 3 buttons', () => {
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Username')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Password')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Phone')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Add User')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Reset')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Cancel')
      })
    })
  })
  describe('Function', () => {
    describe('Add', () => {
      it('successfully add one user', () => {
        let userTable = cy.get('.add-wrapper').get('.user-table')
        userTable.get('.username')
          .type('XSam1224')
        userTable.get('.password')
          .type('123456')
        userTable.get('.phone')
          .type('18351818012')
        userTable.get('.add-btn')
          .click()
        cy.screenshot('backend-add-user')
        cy.wait(5000)
        cy.get('tbody')
          .find('tr')
          .should('have.length', 5)
      })
      it('fails to add one user when the input is invalid', () => {
        let userTable = cy.get('.add-wrapper').get('.user-table')
        userTable.get('.username')
          .type('XS')
        userTable.get('.password')
          .type('123456')
        userTable.get('.phone')
          .type('18351818012')
        userTable.get('.add-btn')
          .click()
        cy.screenshot('backend-add-user-err')
        cy.get('.el-form-item__error')
          .should('contain', 'The length of username should be at least 5 characters')
        cy.wait(1000)
        cy.get('.home')
          .get('.nav-wrapper')
          .find('.nav-item')
          .eq(1)
          .click()
        cy.wait(5000)
        cy.get("tbody")
          .find("tr")
          .should("have.length", 5)

      })
      it('cleans the user table when reset is clicked', () => {
        let userTable = cy.get('.add-wrapper').get('.user-table')
        userTable.get('.username')
          .type('XSam1224')
        userTable.get('.password')
          .type('123456')
        userTable.get('.phone')
          .type('18351818012')
        userTable.get('.reset-btn')
          .click()
        userTable.get('.username')
          .should('have.value', '')
        userTable.get('.password')
          .should('have.value', '')
        userTable.get('.phone')
          .should('have.value', '')
      })
    })
    describe('Cancel', () => {
      it('redirects to the users list page and leaves the users list unchanged when cancel is clicked', () => {
        cy.get('.add-wrapper')
          .get('.user-table')
          .get('.cancel-btn')
          .click()
        cy.wait(5000)
        cy.get('tbody')
          .find('tr')
          .should('have.length', 5)
      })
    })
  })
})
