/**
 * @Author: Sam
 * @Date: 2019/12/10
 * @Version: 1.0
 **/
/* eslint-disable */
let url = 'http://localhost:8080/#/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test add seller page of the backend ui', () => {
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
      .eq(7)
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
          .should('contain', 'Edit Seller')
      })
    })
    describe('Seller form', () => {
      it('shows a seller form with 6 input boxes, 2 image uploader, 1 select and 2 buttons', () => {
        cy.get('.edit-wrapper')
          .get('.seller-table')
          .should('contain', 'Name')
        cy.get('.edit-wrapper')
          .get('.seller-table')
          .should('contain', 'Description')
        cy.get('.edit-wrapper')
          .get('.seller-table')
          .should('contain', 'DeliveryTime')
        cy.get('.edit-wrapper')
          .get('.seller-table')
          .should('contain', 'Bulletin')
        cy.get('.edit-wrapper')
          .get('.seller-table')
          .should('contain', 'Avatar')
        cy.get('.edit-wrapper')
          .get('.seller-table')
          .should('contain', 'Pictures')
        cy.get('.edit-wrapper')
          .get('.seller-table')
          .should('contain', 'Supports')
        cy.get('.edit-wrapper')
          .get('.seller-table')
          .should('contain', 'Information')
        cy.get('.edit-wrapper')
          .get('.seller-table')
          .should('contain', 'Edit Seller')
        cy.get('.edit-wrapper')
          .get('.seller-table')
          .should('contain', 'Cancel')
        cy.get('.support-item')
          .should('have.length', 2)
        cy.get('.info-item')
          .should('have.length', 4)
      })
    })
  })
  describe('Function', () => {
    describe('Edit', () => {
      it('successfully edit one seller', () => {
        let sellerTable = cy.get('.edit-wrapper').get('.seller-table')
          .within(() => {
            cy.get('.name')
              .within(() => {
                cy.get('input')
                  .clear()
                  .type('Chinese Curry')
              })
            cy.screenshot('backend-edit-seller')
            cy.get('.edit-btn')
              .click()
          })
      })
    })
    describe('Cancel', () => {
      it('redirects to the sellers list page and leaves the sellers list unchanged when cancel is clicked', () => {
        cy.get('.edit-wrapper')
          .get('.seller-table')
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
