/**
 * @Author: Sam
 * @Date: 2019/12/10
 * @Version: 1.0
 **/
/* eslint-disable */
let url = 'http://localhost:8080/#/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test edit ratings page of the backend ui', () => {
  before(() => {
    // Get token
    let token = null
    cy.request(`${apiBaseUrl}/token/admin`)
      .its('body')
      .then((res) => {
        expect(res.code).to.equal(0)
        expect(res.message).to.equal('Successfully login, use your token')
        token = res.token

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
      .eq(2)
      .click()
    cy.wait(5000)
    cy.get('tbody')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(6)
      .within(() => {
        cy.get('.el-icon-edit')
          .click()
      })
    cy.wait(5000)
  })
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.edit-ratings-wrapper')
          .get('.title')
          .should('contain', 'Edit Ratings')
      })
    })
    describe('Ratings form', () => {
      it('shows a ratings form', () => {
        cy.get('.edit-ratings-wrapper')
          .get('.ratings-table')
          .should('contain', 'Ratings')
        cy.get('.edit-ratings-wrapper')
          .get('.ratings-table')
          .get('.rating-item')
          .should('have.length', 4)
        cy.get('.rating-outter')
          .eq(0)
          .click()
        cy.get('.rating-item')
          .eq(0)
          .click()
        cy.get('.rating-item')
          .eq(0)
          .get('.input-wrapper')
          .get('.content-wrapper')
          .get('.rating')
          .get('.avatar')
        cy.get('.rating-item')
          .eq(0)
          .get('.input-wrapper')
          .get('.content-wrapper')
          .get('.rating')
          .get('.content')
          .get('.name')
        cy.get('.rating-item')
          .eq(0)
          .get('.input-wrapper')
          .get('.content-wrapper')
          .get('.rating')
          .get('.content')
          .get('.star-wrapper')
          .get('.delivery')
        cy.get('.rating-item')
          .eq(0)
          .get('.input-wrapper')
          .get('.content-wrapper')
          .get('.rating')
          .get('.content')
          .get('.text')
        cy.get('.rating-item')
          .eq(0)
          .get('.input-wrapper')
          .get('.content-wrapper')
          .get('.rating')
          .get('.content')
          .get('.recommend')
          .get('.item')
        cy.get('.rating-item')
          .eq(0)
          .get('.input-wrapper')
          .get('.content-wrapper')
          .get('.rating')
          .get('.content')
          .get('.time')
        cy.get('.icon-wrapper')
          .eq(3)
          .within(() => {
            cy.get('.iconBtn')
              .eq(1)
              .click()
          })
        cy.get('.rating-item')
          .should('have.length', 5)
        cy.get('.rating-item')
          .eq(4)
          .within(() => {
            cy.get('.input-wrapper')
              .should('contain', 'Username')
            cy.get('.input-wrapper')
              .should('contain', 'DeliveryTime')
            cy.get('.input-wrapper')
              .should('contain', 'Score')
            cy.get('.input-wrapper')
              .should('contain', 'RateType')
            cy.get('.input-wrapper')
              .should('contain', 'Text')
            cy.get('.input-wrapper')
              .should('contain', 'Submit Rating')
          })
        cy.get('.cancel-btn')
      })
    })
  })
  describe('Function', () => {
    describe('Edit', () => {
      it('successfully edit ratings of one seller', () => {

      })
    })
    describe('Cancel', () => {
      it('redirects to the sellers list page when cancel is clicked', () => {
        cy.get('.edit-ratings-wrapper')
          .get('.ratings-table')
          .get('.cancel-btn')
          .click()
      })
    })
  })
})
