/**
 * @Author: Sam
 * @Date: 2019/12/10
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test comment order page of the backend ui', () => {
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
      .eq(3)
      .within(() => {
        cy.get('.el-icon-edit-outline')
          .click()
      })
    cy.wait(5000)
  })
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.comment-wrapper')
          .get('.title')
          .should('contain', 'Comment Order')
      })
    })
    describe('Comment form', () => {
      it('shows a comment form', () => {
        cy.get('.comment-wrapper')
          .get('.comment-table')
          .should('contain', 'Seller')
        cy.get('.comment-wrapper')
          .get('.comment-table')
          .should('contain', 'DeliveryTime')
        cy.get('.comment-wrapper')
          .get('.comment-table')
          .should('contain', 'Score')
        cy.get('.comment-wrapper')
          .get('.comment-table')
          .should('contain', 'RateType')
        cy.get('.comment-wrapper')
          .get('.comment-table')
          .should('contain', 'Text')
        cy.get('.comment-wrapper')
          .get('.comment-table')
          .should('contain', 'Recommend')
        cy.get('.comment-wrapper')
          .get('.comment-table')
          .should('contain', 'Comment Order')
        cy.get('.comment-wrapper')
          .get('.comment-table')
          .should('contain', 'Cancel')
        cy.get('.check-item')
          .should('have.length', 2)
      })
    })
  })
  describe('Function', () => {
    describe('Comment', () => {
      it('successfully comments one order', () => {
        cy.get('.delivery')
          .type(30)
        cy.get('.text')
          .type('The food tastes quite wonderful!')
        cy.get('.check-all')
          .click()
        cy.screenshot('backend-comment-order')
        cy.get('.comment-btn')
          .click()
      })
    })
    // describe('Cancel', () => {
    //   it('redirects to the orders list page and leaves the orders list unchanged when cancel is clicked', () => {
    //     cy.get('.comment-wrapper')
    //       .get('.comment-table')
    //       .get('.cancel-btn')
    //       .click()
    //     cy.wait(5000)
    //     cy.get('tbody')
    //       .find('tr')
    //       .should('have.length', 4)
    //   })
    // })
  })
})
