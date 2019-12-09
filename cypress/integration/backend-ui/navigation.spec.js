/**
 * @Author: Sam
 * @Date: 2019/12/9
 * @Version: 1.0
 **/
/* eslint-disable */
let url = 'http://localhost:8080/#/admin/login'
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
        cy.wait(5000)

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
          cy.wait(5000)
        })
        it('redirects to the home page when home is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(0)
            .click()
          cy.wait(5000)
          cy.url().should('contain', '/admin/index')
        })
        it('redirects to the users page when users is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(1)
            .click()
          cy.wait(5000)
          cy.url().should('contain', '/admin/users')
        })
        it('redirects to the sellers page when sellers is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(2)
            .click()
          cy.wait(5000)
          cy.url().should('contain', '/admin/sellers')
        })
        it('redirects to the orders page when orders is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(3)
            .click()
          cy.wait(5000)
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
          cy.wait(5000)
          cy.url().should('contain', '/admin')
        })
        it('redirects to the login page when users is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(1)
            .click()
          cy.wait(5000)
          cy.url().should('contain', '/admin')
        })
        it('redirects to the login page when sellers is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(2)
            .click()
          cy.wait(5000)
          cy.url().should('contain', '/admin')
        })
        it('redirects to the login page when orders is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(3)
            .click()
          cy.wait(5000)
          cy.url().should('contain', '/admin')
        })
        it('logout and redirects to the login page when login is clicked', () => {
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(4)
            .click()
          cy.wait(5000)
          cy.url().should('contain', '/admin/login')
        })
      })
    })
  })
})
