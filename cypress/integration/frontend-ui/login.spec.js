/**
 * @Author: Sam
 * @Date: 2019/12/8
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test login page of the frontend ui', () => {
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

        // Reset sellers
        cy.request(`${apiBaseUrl}/seller`)
          .its('body')
          .then((res) => {
            expect(res.code).to.equal(0)
            res.data.forEach((seller) => {
              cy.request('DELETE', `${apiBaseUrl}/seller/${seller._id}`, {token: token})
            })
          })

        cy.fixture("sellers").then(sellers => {
          let [s1, s2, s3, s4, ...rest] = sellers
          let four = [s1, s2, s3, s4]
          four.forEach(seller => {
            seller.token = token
            cy.request('POST', `${apiBaseUrl}/seller`, seller)
          })
        })

        // Reset goods for sellers
        cy.fixture('goods').then(goods => {
          let data = {
            token: token,
            goods: goods
          }
          cy.request(`${apiBaseUrl}/seller`)
            .its('body')
            .then((res) => {
              expect(res.code).to.equal(0)
              res.data.forEach((seller) => {
                cy.request('PUT', `${apiBaseUrl}/seller/${seller._id}/goods`, data)
              })
            })
        })

        // Reset ratings for sellers
        cy.fixture('ratings').then(ratings => {
          let [r1, r2, r3, r4, ...rest] = ratings
          let four = [r1, r2, r3, r4]
          cy.request(`${apiBaseUrl}/seller`)
            .its('body')
            .then((res) => {
              expect(res.code).to.equal(0)
              res.data.forEach((seller) => {
                four.forEach((rating) => {
                  rating.token = token
                  cy.request('POST', `${apiBaseUrl}/seller/${seller._id}/ratings`, rating)
                })
              })
            })
        })

        // Reset orders
        let headers = {token: token}
        cy.request({
          method: 'GET',
          url: `${apiBaseUrl}/order`,
          headers: headers
        })
          .its('body')
          .then((res) => {
            expect(res.code).to.equal(0)
            res.data.forEach((order) => {
              order.token = token
              cy.request('DELETE', `${apiBaseUrl}/order/${order._id}`, order)
            })
          })

        cy.fixture("orders").then(orders => {
          let [o1, o2, o3, o4, ...rest] = orders
          let four = [o1, o2, o3, o4]
          four.forEach(order => {
            order.token = token
            cy.request('POST', `${apiBaseUrl}/order`, order)
          })
        })
      })
  })
  beforeEach(() => {
    cy.visit(url)
  })
  describe('Content', () => {
    describe('Header', () => {
      it('shows a header', () => {
        cy.get('.header-wrapper')
          .get('.text')
          .should('contain', 'Login')
      })
    })
    describe('Login form', () => {
      it('shows 2 input box, 2 buttons and 1 router link', () => {
        let loginForm = cy.get('.login-form')
        loginForm.should('contain', 'Username')
        loginForm.should('contain', 'Password')
        loginForm.should('contain', 'Login')
        loginForm.should('contain', 'Cancel')
        loginForm.should('contain', 'No account? Register now')
      })
    })
  })
  describe('Function', () => {
    describe('Login', () => {
      it('successfully logins', () => {
        cy.get('.login-form')
          .get('.username')
          .type('admin')
        cy.get('.login-form')
          .get('.password')
          .type('admin')
        cy.get('.login-form')
          .get('.submit')
          .click()
        cy.screenshot('frontend-login-success')
        cy.wait(3000)
        cy.url()
          .should('contain', '/')
        cy.get('.seller-wrapper ul')
          .find('li')
          .should('have.length', 4)
      })
    })
    describe('Cancel login', () => {
      it('redirects to the home page', () => {
        cy.get('.login-form')
          .get('.cancel')
          .click()
        cy.wait(3000)
        cy.url()
          .should('contain', '/')
        cy.get('.seller-wrapper ul')
          .find('li')
          .should('have.length', 4)
      })
    })
    describe('Go to register', () => {
      it('redirects to the register page', () => {
        cy.get('.login-form')
          .get('.register')
          .click()
        cy.wait(3000)
        cy.url()
          .should('contain', '/register')
        cy.get('.header-wrapper')
          .get('.text')
          .should('contain', 'Register')
      })
    })
  })
})
