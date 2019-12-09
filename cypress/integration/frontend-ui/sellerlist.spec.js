/**
 * @Author: Sam
 * @Date: 2019/12/9
 * @Version: 1.0
 **/
/* eslint-disable */
let url = 'http://localhost:8080/#/'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test home page of the frontend ui', () => {
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
          .should('contain', 'Take-Away App')
      })
    })
    describe('Search', () => {
      it('shows a search box', () => {
        cy.get('.search-wrapper')
          .get('.search')
          .should('have.value', '')
      })
    })
    describe('Seller list', () => {
      it('shows 4 sellers', () => {
        cy.get('.seller-wrapper ul')
          .find('li')
          .should('have.length', 4)
      })
    })
  })
  describe('Function', () => {
    describe('Search', () => {
      it('gets the corresponded list of food and updates the dom', () => {
        cy.get('.search-wrapper')
          .get('.search')
          .type('seller1')
        cy.get('.search-wrapper')
          .get('.search')
          .get('.el-input__icon')
          .click()
        cy.wait(5000)
        cy.screenshot('search-success')
        cy.get('.seller-wrapper ul')
          .find('li')
          .should('have.length', 1)
          .eq(0)
          .get('.content-wrapper')
          .get('.name')
          .should('contain', 'Seller1')
      })
    })
    describe('Select seller', () => {
      it('redirects to the seller page of a selected seller', () => {
        cy.get('.seller-wrapper ul')
          .find('li')
          .eq(0)
          .click()
        cy.get('.tab')
          .find('.tab-item')
          .should('have.length', 3)
        cy.get('.tab')
          .find('.tab-item')
          .eq(0)
          .should('contain', 'Goods')
        cy.get('.tab')
          .find('.tab-item')
          .eq(1)
          .should('contain', 'Ratings')
        cy.get('.tab')
          .find('.tab-item')
          .eq(2)
          .should('contain', 'Seller')
        cy.get('.goods')
          .get('.menu-wrapper ul')
          .find('li')
          .should('have.length', 1)
        cy.get('.foods-wrapper')
          .find('.food-list')
          .should('have.length', 1)
        cy.get('.foods-wrapper')
          .find('.food-item')
          .should('have.length', 2)
      })
    })
  })
})
