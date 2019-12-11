/**
 * @Author: Sam
 * @Date: 2019/12/10
 * @Version: 1.0
 **/
/* eslint-disable */
let url = 'http://localhost:8080/#/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test edit order page of the backend ui', () => {
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
    cy.get('.home')
      .get('.nav-wrapper')
      .find('.nav-item')
      .eq(3)
      .click()
    cy.wait(5000)
    cy.get('tbody')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(4)
      .within(() => {
        cy.get('.el-icon-setting')
          .click()
      })
    cy.wait(5000)
  })
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.edit-wrapper')
          .get('.title')
          .should('contain', 'Edit Order')
      })
    })
    describe('Order form', () => {
      it('shows a order form', () => {
        cy.get('.edit-wrapper')
          .get('.order-table')
          .should('contain', 'User')
        cy.get('.edit-wrapper')
          .get('.order-table')
          .should('contain', 'Seller')
        cy.get('.edit-wrapper')
          .get('.order-table')
          .should('contain', 'Address')
        cy.get('.edit-wrapper')
          .get('.order-table')
          .should('contain', 'Phone')
        cy.get('.edit-wrapper')
          .get('.order-table')
          .should('contain', 'Note')
        cy.get('.edit-wrapper')
          .get('.order-table')
          .should('contain', 'Status')
        cy.get('.edit-wrapper')
          .get('.order-table')
          .should('contain', 'Foods')
        cy.get('.edit-wrapper')
          .get('.order-table')
          .should('contain', 'Edit Order')
        cy.get('.edit-wrapper')
          .get('.order-table')
          .should('contain', 'Cancel')
        cy.get('.food-item')
          .should('have.length', 2)
        cy.get('.food-item')
          .eq(0)
          .click()
        cy.get('.food-item')
          .eq(0)
          .should('contain', 'Name')
        cy.get('.food-item')
          .eq(0)
          .should('contain', 'Quantity')
        cy.get('.food-item')
          .eq(0)
          .should('contain', 'Price')
      })
    })
  })
  describe('Function', () => {
    describe('Edit', () => {
      it('successfully edit one order', () => {
        cy.get('.google-map-address-input')
          .type('Waterford Institute of Technology')
        cy.get('.google-map-address-select')
          .contains('Select')
          .click()
        cy.get('.phone')
          .within(() => {
            cy.get('input')
              .clear()
              .type('8618351818012')
          })
        cy.get('.note')
          .within(() => {
            cy.get('input')
              .clear()
              .type('Much ketch up!')
          })
        cy.get('.iconBtn')
          .eq(0)
          .click()
        cy.get('.iconBtn')
          .eq(1)
          .click()
        cy.get('.food-item')
          .eq(1)
          .click()
        cy.get('.food-item')
          .eq(1)
          .within(() => {
            cy.get('.name')
              .type('Tomato Soup')
          })
        cy.get('.food-item')
          .eq(1)
          .within(() => {
            cy.get('.price')
              .within(() => {
                cy.get('input')
                  .clear()
                  .type(5)
              })
          })
        cy.get('.food-item')
          .eq(1)
          .within(() => {
            cy.get('.quantity')
              .within(() => {
                cy.get('input')
                  .clear()
                  .type(3)
              })
          })
        cy.screenshot('backend-edit-order')
        cy.get('.edit-btn')
          .click()
      })
    })
    describe('Cancel', () => {
      it('redirects to the orders list page and leaves the orders list unchanged when cancel is clicked', () => {
        cy.get('.edit-wrapper')
          .get('.order-table')
          .get('.cancel-btn')
          .click()
        cy.wait(5000)
        cy.get('tbody')
          .find('tr')
          .should('have.length', 4)
      })
    })
  })
})
