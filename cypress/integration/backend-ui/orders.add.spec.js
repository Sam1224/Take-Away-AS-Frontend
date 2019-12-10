/**
 * @Author: Sam
 * @Date: 2019/12/10
 * @Version: 1.0
 **/
/* eslint-disable */
let url = 'http://localhost:8080/#/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test add order page of the backend ui', () => {
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
    cy.get('.orderslist-wrapper')
      .get('.orders-table')
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
          .should('contain', 'Add Order')
      })
    })
    describe('Order form', () => {
      it('shows a order form', () => {
        cy.get('.add-wrapper')
          .get('.order-table')
          .should('contain', 'User')
        cy.get('.add-wrapper')
          .get('.order-table')
          .should('contain', 'Seller')
        cy.get('.add-wrapper')
          .get('.order-table')
          .should('contain', 'Address')
        cy.get('.add-wrapper')
          .get('.order-table')
          .should('contain', 'Phone')
        cy.get('.add-wrapper')
          .get('.order-table')
          .should('contain', 'Note')
        cy.get('.add-wrapper')
          .get('.order-table')
          .should('contain', 'Foods')
        cy.get('.add-wrapper')
          .get('.order-table')
          .should('contain', 'Add Order')
        cy.get('.add-wrapper')
          .get('.order-table')
          .should('contain', 'Reset')
        cy.get('.add-wrapper')
          .get('.order-table')
          .should('contain', 'Cancel')

        cy.get('tbody')
          .eq(0)
          .within(() => {
            cy.get('tr')
              .should('have.length', 4)
          })
        cy.get('tbody')
          .eq(1)
          .within(() => {
            cy.get('tr')
              .should('have.length', 4)
          })
      })
    })
  })
  describe('Function', () => {
    describe('Add', () => {
      it('successfully add one order', () => {
        cy.get('.add-wrapper')
          .get('.order-table')
          .get('tbody')
          .eq(0)
          .within(() => {
            cy.get('tr')
              .eq(0)
              .find('td')
              .eq(0)
              .within(() => {
                cy.get('button')
                  .click()
              })
           })
        cy.get('.add-wrapper')
          .get('.order-table')
          .get('tbody')
          .eq(0)
          .within(() => {
            cy.get('tr')
              .eq(0)
              .find('td')
              .eq(0)
              .within(() => {
                cy.get('button')
                  .click()
              })
          })
        cy.get('.google-map-address-input')
          .type('BLOCK 2, RIVERWALK, INNER RING ROAD, WATERFORD, IRELAND')
        cy.get('.google-map-address-select')
          .contains('Select')
          .click()
        cy.get('.phone')
          .type('0894889596')
        cy.get('.note')
          .type('Donot spicy please')
        cy.get('.food-list')
          .should('have.length', 1)
        cy.get('.food-list')
          .eq(0)
          .click()
        cy.wait(2000)
        cy.get('.food-item')
          .should('have.length', 2)
        cy.get('.cart-add')
          .eq(0)
          .click()
        cy.screenshot('backend-add-order')
        cy.get('.add-btn')
          .click()
        cy.wait(5000)
        cy.get('tbody')
          .find('tr')
          .should('have.length', 5)
      })
      it('cleans the order table when reset is clicked', () => {
        cy.get('.add-wrapper')
          .get('.order-table')
          .get('tbody')
          .eq(0)
          .within(() => {
            cy.get('tr')
              .eq(0)
              .find('td')
              .eq(0)
              .within(() => {
                cy.get('button')
                  .click()
              })
          })
        cy.get('.add-wrapper')
          .get('.order-table')
          .get('tbody')
          .eq(0)
          .within(() => {
            cy.get('tr')
              .eq(0)
              .find('td')
              .eq(0)
              .within(() => {
                cy.get('button')
                  .click()
              })
          })
        cy.get('.google-map-address-input')
          .type('BLOCK 2, RIVERWALK, INNER RING ROAD, WATERFORD, IRELAND')
        cy.get('.google-map-address-select')
          .contains('Select')
          .click()
        cy.get('.phone')
          .type('0894889596')
        cy.get('.note')
          .type('Donot spicy please')
        cy.get('.food-list')
          .should('have.length', 1)
        cy.get('.food-list')
          .eq(0)
          .click()
        cy.wait(2000)
        cy.get('.food-item')
          .should('have.length', 2)
        cy.get('.cart-add')
          .eq(0)
          .click()
        cy.get('.reset-btn')
          .click()
        cy.get('.add-wrapper')
          .get('.order-table')
          .within(() => {
            cy.get('.user')
              .should('have.value', '')
            cy.get('.seller')
              .should('have.value', '')
            cy.get('.address')
              .should('have.value', '')
            cy.get('.phone')
              .should('have.value', '')
            cy.get('.food-list')
              .should('have.length', 0)
          })
      })
    })
    describe('Cancel', () => {
      it('redirects to the orders list page and leaves the orders list unchanged when cancel is clicked', () => {
        cy.get('.add-wrapper')
          .get('.order-table')
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
