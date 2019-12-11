/**
 * @Author: Sam
 * @Date: 2019/12/9
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test navigation bar of the backend ui', () => {
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
    describe('Navigation bar', () => {
      it('shows 1 arrow icon and 5 router links when not logined', () => {
        cy.get('.home')
          .get('.nav-wrapper')
          .get('.info-btn')
        cy.get('.home')
          .get('.nav-wrapper')
          .find('.nav-item')
          .should('have.length', 5)
        cy.get('.home')
          .get('.nav-wrapper')
          .within(() => {
            cy.get('.nav-item')
              .eq(0)
              .should('contain', 'Home')
            cy.get('.nav-item')
              .eq(1)
              .should('contain', 'Users')
            cy.get('.nav-item')
              .eq(2)
              .should('contain', 'Sellers')
            cy.get('.nav-item')
              .eq(3)
              .should('contain', 'Orders')
            cy.get('.nav-item')
              .eq(4)
              .should('contain', 'Login')
          })
      })
      it('shows 1 arrow icon, 5 router links and an avatar with name when already logined', () => {
        cy.get('.login-table')
          .get('.username')
          .type('admin')
        cy.get('.login-table')
          .get('.password')
          .type('admin')
        cy.get('.login-table')
          .get('.submit')
          .click()
        cy.wait(3000)

        cy.get('.home')
          .get('.nav-wrapper')
          .get('.info-btn')
        cy.get('.home')
          .get('.nav-wrapper')
          .find('.nav-item')
          .should('have.length', 5)
        cy.get('.home')
          .get('.nav-wrapper')
          .within(() => {
            cy.get('.nav-item')
              .eq(0)
              .should('contain', 'Home')
            cy.get('.nav-item')
              .eq(1)
              .should('contain', 'Users')
            cy.get('.nav-item')
              .eq(2)
              .should('contain', 'Sellers')
            cy.get('.nav-item')
              .eq(3)
              .should('contain', 'Orders')
            cy.get('.nav-item')
              .eq(4)
              .should('contain', 'Logout')
            cy.get('.avatar')
            cy.get('.name')
              .should('contain', 'admin')
          })
      })
    })
  })
  describe('Function', () => {
    describe('Drawer', () => {
      it('opens the drawer from the left side when the icon button is clicked', () => {
        cy.get('.home')
          .get('.nav-wrapper')
          .get('.info-btn')
          .click()
        cy.get('.home')
          .get('.drawer-wrapper')
          .get('.content')
          .should('contain', 'Take-Away App - Backend')

        cy.screenshot('backend-open-drawer')
      })
    })
    describe('Redirection', () => {
      describe('Already logined', () => {
        beforeEach(() => {
          cy.get('.login-table')
            .get('.username')
            .type('admin')
          cy.get('.login-table')
            .get('.password')
            .type('admin')
          cy.get('.login-table')
            .get('.submit')
            .click()
          cy.wait(3000)
        })
        it('redirects to the home page when home is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(0)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin/index')
        })
        it('redirects to the users page when users is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(1)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin/users')
        })
        it('redirects to the sellers page when sellers is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(2)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin/sellers')
        })
        it('redirects to the orders page when orders is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(3)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin/orders')
        })
      })
      describe('Not logined', () => {
        it('redirects to the login page when home is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(0)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin')
        })
        it('redirects to the login page when users is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(1)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin')
        })
        it('redirects to the login page when sellers is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(2)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin')
        })
        it('redirects to the login page when orders is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(3)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin')
        })
        it('logout and redirects to the login page when login is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(4)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin/login')
        })
      })
    })
  })
})
