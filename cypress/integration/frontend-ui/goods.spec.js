/**
 * @Author: Sam
 * @Date: 2019/12/9
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test goods page of sellerhome of the frontend ui', () => {
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
    cy.get('.seller-wrapper ul')
      .find('li')
      .eq(0)
      .click()
  })
  describe('Content', () => {
    describe('Seller header', () => {
      it('shows a seller header', () => {
        cy.get('.header')
      })
    })
    describe('Goods', () => {
      describe('Menu', () => {
        it('shows a menu side bar', () => {
          cy.get('.goods')
            .get('.menu-wrapper ul')
            .find('li')
            .should('have.length', 1)
        })
      })
      describe('Foods', () => {
        it('shows a list of foods', () => {
          cy.get('.goods')
            .get('.foods-wrapper')
            .find('.food-list')
            .should('have.length', 1)
          cy.get('.goods')
            .get('.foods-wrapper')
            .find('.food-item')
            .should('have.length', 2)
          cy.get('.goods')
            .get('.foods-wrapper')
            .find('.food-item')
            .eq(0)
            .get('.icon')
          cy.get('.goods')
            .get('.foods-wrapper')
            .find('.food-item')
            .eq(0)
            .get('.content')
            .get('.name')
          cy.get('.goods')
            .get('.foods-wrapper')
            .find('.food-item')
            .eq(0)
            .get('.content')
            .get('.desc')
          cy.get('.goods')
            .get('.foods-wrapper')
            .find('.food-item')
            .eq(0)
            .get('.content')
            .get('.extra')
            .get('.count')
          cy.get('.goods')
            .get('.foods-wrapper')
            .find('.food-item')
            .eq(0)
            .get('.content')
            .get('.price')
            .get('.now')
          cy.get('.goods')
            .get('.foods-wrapper')
            .find('.food-item')
            .eq(0)
            .get('.content')
            .get('.cartcontrol-wrapper')
        })
        it('shows a shopcart', () => {
          cy.get('.goods')
            .get('.foods-wrapper')
            .get('.shopcart')
        })
      })
      describe('Food detail mask', () => {
        it('shows a mask of detailed info of a selected food', () => {
          cy.get('.goods')
            .get('.food-mask')
        })
      })
    })
  })
  describe('Function', () => {
    describe('Add food', () => {
      it('adds the selected food to shopcart', () => {
        cy.get('.goods')
          .get('.foods-wrapper')
          .find('.food-item')
          .eq(0)
          .get('.content')
          .get('.cartcontrol-wrapper')
          .get('.cartcontrol')
          .get('.cart-add')
          .eq(0)
          .click()
        cy.get('.goods')
          .get('.foods-wrapper')
          .find('.food-item')
          .eq(0)
          .get('.content')
          .get('.cartcontrol-wrapper')
          .get('.cartcontrol')
          .get('.cart-decrease')
        cy.get('.goods')
          .get('.foods-wrapper')
          .find('.food-item')
          .eq(0)
          .get('.content')
          .get('.cartcontrol-wrapper')
          .get('.cartcontrol')
          .get('.cart-count')
          .should('contain', '1')
        cy.get('.goods')
          .get('.shopcart')
          .get('.shopcart-list')
          .get('.list-content')
          .find('.food')
          .should('have.length', 1)
        cy.screenshot('add-food')
      })
    })
    describe('Decrease food', () => {
      it('decrease the number of  the selected food by 1', () => {
        cy.get('.goods')
          .get('.foods-wrapper')
          .find('.food-item')
          .eq(0)
          .get('.content')
          .get('.cartcontrol-wrapper')
          .get('.cartcontrol')
          .get('.cart-add')
          .eq(0)
          .click()
        cy.get('.goods')
          .get('.foods-wrapper')
          .find('.food-item')
          .eq(0)
          .get('.content')
          .get('.cartcontrol-wrapper')
          .get('.cartcontrol')
          .get('.cart-add')
          .eq(0)
          .click()
        cy.get('.goods')
          .get('.foods-wrapper')
          .find('.food-item')
          .eq(0)
          .get('.content')
          .get('.cartcontrol-wrapper')
          .get('.cartcontrol')
          .get('.cart-decrease')
          .eq(0)
          .click()
        cy.get('.goods')
          .get('.foods-wrapper')
          .find('.food-item')
          .eq(0)
          .get('.content')
          .get('.cartcontrol-wrapper')
          .get('.cartcontrol')
          .get('.cart-count')
          .should('contain', '1')
        cy.screenshot('dec-food')
      })
    })
    describe('Show food detail', () => {
      it('shows the food detail when click on a food', () => {
        cy.get('.goods')
          .get('.foods-wrapper')
          .find('.food-item')
          .eq(0)
          .click()
        cy.get('.food-mask')
          .get('.food')
          .get('.food-content')
        cy.screenshot('food-detail')
      })
    })
    describe('Empty shopcart', () => {
      it('Remove all foods selected in shopcart', () => {
        cy.get('.goods')
          .get('.foods-wrapper')
          .find('.food-item')
          .eq(0)
          .get('.content')
          .get('.cartcontrol-wrapper')
          .get('.cartcontrol')
          .get('.cart-add')
          .eq(0)
          .click()
        cy.get('.goods')
          .get('.foods-wrapper')
          .find('.food-item')
          .eq(1)
          .get('.content')
          .get('.cartcontrol-wrapper')
          .get('.cartcontrol')
          .get('.cart-add')
          .eq(0)
          .click()
        cy.get('.goods')
          .get('.shopcart')
          .find('.content')
          .eq(0)
          .click()
        cy.get('.goods')
          .get('.shopcart')
          .get('.shopcart-list')
          .get('.list-header')
          .get('.empty')
          .click()
        cy.get('.goods')
          .get('.shopcart')
          .get('.shopcart-list')
          .get('.list-content')
          .find('.food')
          .should('have.length', 0)
        cy.screenshot('empty-shopcart')
      })
    })
  })
})
