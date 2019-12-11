/**
 * @Author: Sam
 * @Date: 2019/12/10
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test sellers list page of the backend ui', () => {
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
    cy.wait(3000)
    cy.get('.home')
      .get('.nav-wrapper')
      .find('.nav-item')
      .eq(2)
      .click()
    cy.wait(3000)
  })
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.sellerslist-wrapper')
          .get('.vue-title')
          .should('contain', 'Seller List')
      })
    })
    describe('Sellers table', () => {
      it('shows a sellers table', () => {
        cy.get('tbody')
          .find('tr')
          .should('have.length', 4)
        cy.get('.sellerslist-wrapper')
          .get('.sellers-table')
          .get('.tab-wrapper')
          .get('.tab-item')
          .get('.add')
          .should('contain', 'Add Seller')
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
          .should('contain', 'Name')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Description')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'DeliveryTime')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'GeneralScore')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'ServiceScore')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'FoodScore')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'RankRate')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Bulletin')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Avatar')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Pictures')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Supports')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Information')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Goods')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Ratings')
      })
    })
    describe('Redirection', () => {
      it('redirects to add seller page when add seller is clicked', () => {
        cy.get('.sellerslist-wrapper')
          .get('.sellers-table')
          .get('.tab-wrapper')
          .get('.tab-item')
          .get('.add')
          .click()
        cy.url()
          .should('contain', '/admin/sellers/add')
      })
      it('redirects to edit goods page when edit goods is clicked', () => {
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(5)
          .within(() => {
            cy.get('.el-icon-tableware')
              .click()
          })
        cy.url()
          .should('contain', '/admin/sellers/editgoods')
      })
      it('redirects to edit ratings page when edit ratings is clicked', () => {
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(6)
          .within(() => {
            cy.get('.el-icon-edit')
              .click()
          })
        cy.url()
          .should('contain', '/admin/sellers/editratings')
      })
      it('redirects to edit seller page when edit seller is clicked', () => {
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(7)
          .within(() => {
            cy.get('.el-icon-setting')
              .click()
          })
        cy.url()
          .should('contain', '/admin/sellers/edit')
      })
    })
    describe('Delete', () => {
      it('successfully deletes one seller when the deletion is confirmed', () => {
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(8)
          .within(() => {
            cy.get('.el-icon-delete')
              .click()
          })
        cy.screenshot('backend-seller-delete-confirm')
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
          .eq(8)
          .within(() => {
            cy.get('.el-icon-delete')
              .click()
          })
        cy.screenshot('backend-seller-delete-cancel')
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
