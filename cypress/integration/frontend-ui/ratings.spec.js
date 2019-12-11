/**
 * @Author: Sam
 * @Date: 2019/12/9
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test ratings page of sellerhome of the frontend ui', () => {
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
    cy.get('.sellerhome')
      .get('.tab')
      .find('.tab-item')
      .eq(1)
      .click()
  })
  describe('Content', () => {
    describe('Seller header', () => {
      it('shows a seller header', () => {
        cy.get('.header')
      })
    })
    describe('Ratings', () => {
      describe('Overview', () => {
        it('shows scores and rankings', () => {
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.overview')
            .get('.overview-left')
            .get('.score')
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.overview')
            .get('.overview-left')
            .get('.title')
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.overview')
            .get('.overview-left')
            .get('.rank')
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.overview')
            .get('.overview-right')
            .get('.score-wrapper')
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.overview')
            .get('.overview-right')
            .get('.delivery-wrapper')
        })
      })
      describe('Rating options', () => {
        it('shows 3 options of ratings to be shown', () => {
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.ratingselect')
            .should('contain', 'All')
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.ratingselect')
            .should('contain', 'Satisfied')
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.ratingselect')
            .should('contain', 'Unsatisfied')
        })
      })
      describe('Ratings', () => {
        it('shows a list of ratings', () => {
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.rating-wrapper ul')
            .find('li')
            .should('have.length', 3)
        })
      })
    })
  })
  describe('Function', () => {
    describe('Filter ratings', () => {
      describe('Filter by satisfatory', () => {
        it('shows all ratings with contents by default', () => {
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.ratingselect')
            .get('.rating-type')
            .find('.block')
            .eq(0)
            .click()
          cy.wait(1000)
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.rating-wrapper ul')
            .find('.rating-item')
            .should('have.length', 3)
          cy.screenshot('all-ratings-contents')
        })
        it('shows satisfied ratings with contents when satisfied is clicked', () => {
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.ratingselect')
            .get('.rating-type')
            .find('.block')
            .eq(1)
            .click()
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.rating-wrapper ul')
            .find('li')
            .should('have.length', 3)
          cy.screenshot('satisfied-ratings-contents')
        })
        it('shows unsatisfied ratings with contents when unsatisfied is clicked', () => {
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.ratingselect')
            .get('.rating-type')
            .find('.block')
            .eq(2)
            .click()
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.rating-wrapper ul')
            .find('li')
            .should('have.length', 0)
          cy.screenshot('unsatisfied-ratings-contents')
        })
      })
      describe('Filter by whether there is content', () => {
        it('shows ratings no matter there is content or not by default', () => {
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.rating-wrapper ul')
            .find('li')
            .should('have.length', 3)
        })
        it('shows ratings with contents when Contents Only is selected', () => {
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.ratingselect')
            .get('.switch')
            .click()
          cy.get('.ratings')
            .get('.ratings-content')
            .get('.rating-wrapper ul')
            .find('li')
            .should('have.length', 4)
        })
      })
    })
  })
})
