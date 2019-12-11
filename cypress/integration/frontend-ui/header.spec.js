/**
 * @Author: Sam
 * @Date: 2019/12/9
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test the header of sellerhome of the frontend ui', () => {
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
          .get('.content-wrapper')
          .get('.back')
        cy.get('.header')
          .get('.content-wrapper')
          .get('.avatar')
        cy.get('.header')
          .get('.content-wrapper')
          .get('.content')
          .get('.title')
          .get('.brand')
        cy.get('.header')
          .get('.content-wrapper')
          .get('.content')
          .get('.title')
          .get('.name')
        cy.get('.header')
          .get('.content-wrapper')
          .get('.content')
          .get('.description')
        cy.get('.header')
          .get('.content-wrapper')
          .get('.content')
          .get('.support')

        cy.get('.header')
          .get('.content-wrapper')
          .get('.support-count')

        cy.get('.header')
          .get('.bulletin-wrapper')

        cy.get('.header')
          .get('.background')
      })
    })
  })
  describe('Function', () => {
    describe('Details', () => {
      it('shows a mask with details', () => {
        cy.get('.header')
          .get('.detail')
          .get('.content-wrapper')
          .get('.support-count')
          .click()

        cy.get('.header')
          .get('.detail')
          .get('.detail-wrapper')
          .get('.detail-main')
          .get('.name')
        cy.get('.header')
          .get('.detail')
          .get('.detail-wrapper')
          .get('.detail-main')
          .get('.star-wrapper')
        cy.get('.header')
          .get('.detail')
          .get('.detail-wrapper')
          .get('.detail-main')
          .get('.title')
          .should('contain', 'Supports')
        cy.get('.header')
          .get('.detail')
          .get('.detail-wrapper')
          .get('.detail-main')
          .get('.supports')
          .find('.support-item')
          .should('have.length', 2)
        cy.get('.header')
          .get('.detail')
          .get('.detail-wrapper')
          .get('.detail-main')
          .get('.title')
          .should('contain', 'Bulletin')
        cy.get('.header')
          .get('.detail')
          .get('.detail-wrapper')
          .get('.detail-main')
          .get('.bulletin')

        cy.get('.header')
          .get('.detail')
          .get('.detail-close')

        cy.screenshot('header-show-details')
      })
    })
    describe('Back', () => {
      it('goes back to the home page of frontend ui when click on the arrow', () => {
        cy.get('.header')
          .get('.content-wrapper')
          .get('.back')
          .eq(0)
          .click()
        cy.wait(3000)
        cy.url()
          .should('contain', '/')
        cy.get('.seller-wrapper ul')
          .find('li')
          .should('have.length', 4)

        cy.screenshot('header-go-back')
      })
    })
  })
})
