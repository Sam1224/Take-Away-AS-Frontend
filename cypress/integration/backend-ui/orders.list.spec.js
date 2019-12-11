/**
 * @Author: Sam
 * @Date: 2019/12/10
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test orders list page of the backend ui', () => {
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
  })
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.orderslist-wrapper')
          .get('.vue-title')
          .should('contain', 'Order List')
      })
    })
    describe('Orders table', () => {
      it('shows a orders table', () => {
        cy.get('tbody')
          .find('tr')
          .should('have.length', 4)
        cy.get('.orderslist-wrapper')
          .get('.orders-table')
          .get('.tab-wrapper')
          .get('.tab-item')
          .get('.add')
          .should('contain', 'Add Order')
      })
    })
  })
  describe('Function', () => {
    describe('A detailed form in child row', () => {
      it('shows a child row when the symbol + is clicked', () => {
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(0)
          .click()
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'User')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Seller')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Note')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Address')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Phone')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Foods')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Status')
      })
    })
    describe('Redirection', () => {
      it('redirects to add order page when add order is clicked', () => {
        cy.get('.orderslist-wrapper')
          .get('.orders-table')
          .get('.tab-wrapper')
          .get('.tab-item')
          .get('.add')
          .click()
        cy.url()
          .should('contain', '/admin/orders/add')
      })
      it('redirects to edit order page when edit order is clicked', () => {
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(4)
          .within(() => {
            cy.get('.el-icon-setting')
              .click()
          })
        cy.url()
          .should('contain', '/admin/orders/edit')
      })
      it('redirects to comment order page when comment order is clicked', () => {
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(3)
          .within(() => {
            cy.get('.el-icon-edit-outline')
              .click()
          })
        cy.url()
          .should('contain', '/admin/orders/comment')
      })
    })
    describe('Delete', () => {
      it('successfully deletes one order when the deletion is confirmed', () => {
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(5)
          .within(() => {
            cy.get('.el-icon-delete')
              .click()
          })
        cy.screenshot('backend-order-delete-confirm')
        cy.get('button')
          .contains('Delete')
          .click()
        cy.get('tbody')
          .find('tr')
          .should('have.length', 3)
      })
      it('leaves the list unchanged when the deletion is canceled', () => {
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(5)
          .within(() => {
            cy.get('.el-icon-delete')
              .click()
          })
        cy.screenshot('backend-order-delete-cancel')
        cy.get('button')
          .contains('Cancel')
          .click()
        cy.get('tbody')
          .find('tr')
          .should('have.length', 3)
      })
    })
  })
})
