/**
 * @Author: Sam
 * @Date: 2019/12/9
 * @Version: 1.0
 **/
/* eslint-disable */
let url = 'http://localhost:8080/#/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test index page of the backend ui', () => {
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
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.index')
          .get('.vue-title')
          .should('contain', 'Welcome to the Backend of Take-Away App!')
      })
    })
    describe('Slider', () => {
      it('shows a slider with 9 images', () => {
        cy.get('.index')
          .get('.slides')
          .find('.slide-item')
          .should('have.length', 9)
      })
    })
  })
})
