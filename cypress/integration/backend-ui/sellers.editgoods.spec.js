/**
 * @Author: Sam
 * @Date: 2019/12/10
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test edit goods page of the backend ui', () => {
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
    cy.get('tbody')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(5)
      .within(() => {
        cy.get('.el-icon-tableware')
          .click()
      })
    cy.wait(3000)
  })
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.edit-goods-wrapper')
          .get('.title')
          .should('contain', 'Edit Goods')
      })
    })
    describe('Goods form', () => {
      it('shows a complex goods form', () => {
        cy.get('.edit-goods-wrapper')
          .get('.goods-table')
          .should('contain', 'Goods')
        cy.get('.edit-goods-wrapper')
          .get('.goods-table')
          .get('.good-wrapper')
          .should('have.length', 1)
        cy.get('.good-item')
          .eq(0)
          .click()
        cy.get('.input-wrapper')
          .should('contain', 'GoodName')
        cy.get('.input-wrapper')
          .get('.food-wrapper')
          .should('have.length', 2)
        cy.get('.input-wrapper')
          .get('.food-wrapper')
          .eq(0)
          .click()
        cy.get('.input-wrapper')
          .eq(1)
          .should('contain', 'FoodName')
        cy.get('.input-wrapper')
          .eq(1)
          .should('contain', 'Description')
        cy.get('.input-wrapper')
          .eq(1)
          .should('contain', 'Information')
        cy.get('.input-wrapper')
          .eq(1)
          .should('contain', 'Price')
        cy.get('.input-wrapper')
          .eq(1)
          .should('contain', 'OldPrice')
        cy.get('.input-wrapper')
          .eq(1)
          .should('contain', 'Image')
        cy.get('.input-wrapper')
          .eq(1)
          .should('contain', 'Icon')
        cy.get('.edit-btn')
        cy.get('.cancel-btn')
      })
    })
  })
  describe('Function', () => {
    describe('Edit', () => {
      it('successfully edit goods of one seller', () => {
        cy.get('.good-wrapper')
          .within(() => {
            cy.get('.good-icon-wrapper')
              .eq(0)
              .within(() => {
                cy.get('.iconBtn')
                  .eq(1)
                  .click()
              })
          })
        cy.get('.good-item')
          .eq(1)
          .click()
        cy.get('.good-item')
          .eq(1)
          .within(() => {
            cy.get('.goodname')
              .type('Special')
            cy.get('.food-item')
              .eq(0)
              .click()
            cy.get('.food-item')
              .eq(0)
              .within(() => {
                cy.get('.foodname')
                  .type('Minced Pork Congee with Preserved Egg')
                cy.get('.desc')
                  .type('Salty porridge')
                cy.get('.info')
                  .type('.A bowl of preserved egg thin meat porridge, always I go to the porridge shop when the selection of fragrant soft, full belly warm heart, preserved egg Q bomb and thin meat slippery with porridge fragrant overflow at full mouth, let a person drink such a bowl of porridge also feel satisfied.')
                cy.get('.price')
                  .within(() => {
                    cy.get('input')
                      .clear()
                      .type(10)
                  })
                let fileName = 'seller_food_image.jpg'
                cy.fixture(fileName).then(fileContent => {
                  cy.get('.upload-wrapper')
                    .eq(0)
                    .within(() => {
                      cy.get('.el-upload__input')
                        .upload({
                          fileContent,
                          fileName,
                          mimeType: 'image/jpeg'
                        })
                    })
                })
                fileName = 'seller_food_icon.jpg'
                cy.fixture(fileName).then(fileContent => {
                  cy.get('.upload-wrapper')
                    .eq(1)
                    .within(() => {
                      cy.get('.el-upload__input')
                        .upload({
                          fileContent,
                          fileName,
                          mimeType: 'image/jpeg'
                        })
                    })
                })
              })
          })
        cy.wait(20000)
        cy.get('.edit-btn')
          .click()
        cy.screenshot('backend-edit-goods')
      })
    })
    describe('Cancel', () => {
      it('redirects to the sellers list page when cancel is clicked', () => {
        cy.get('.edit-goods-wrapper')
          .get('.goods-table')
          .get('.cancel-btn')
          .click()
      })
    })
  })
})
