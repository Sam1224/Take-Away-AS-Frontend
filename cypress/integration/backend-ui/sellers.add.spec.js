/**
 * @Author: Sam
 * @Date: 2019/12/10
 * @Version: 1.0
 **/
/* eslint-disable */
let url = '/admin/login'
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
    cy.get('.sellerslist-wrapper')
      .get('.sellers-table')
      .get('.tab-wrapper')
      .get('.tab-item')
      .get('.add')
      .click()
  })
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.add-wrapper')
          .get('.title')
          .should('contain', 'Add Seller')
      })
    })
    describe('Seller form', () => {
      it('shows a seller form with 6 input boxes, 2 image uploader, 1 select and 3 buttons', () => {
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'Name')
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'Description')
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'DeliveryTime')
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'Bulletin')
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'Avatar')
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'Pictures')
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'Supports')
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'Information')
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'Add Seller')
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'Reset')
        cy.get('.add-wrapper')
          .get('.seller-table')
          .should('contain', 'Cancel')
      })
    })
  })
  describe('Function', () => {
    describe('Add', () => {
      it('successfully add one seller', () => {
        let sellerTable = cy.get('.add-wrapper').get('.seller-table')
          .within(() => {
            cy.get('.name')
              .type('Chinese Restaurant')
            cy.get('.desc')
              .type('Self delivery')
            cy.get('.delivery')
              .type('34')
            cy.get('.bulletin')
              .type('Providing with special Chinese food')
            const fileName = 'seller_avatar_256px.jpg'
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
            const pics = [
              'seller_pics_0.jpg',
              'seller_pics_1.jpg',
              'seller_pics_2.jpg',
              'seller_pics_3.jpg'
            ]
            cy.get('.upload-wrapper')
              .eq(1)
              .within(() => {
                pics.forEach((pic) => {
                  let fileName = pic
                  cy.fixture(fileName).then(fileContent => {
                    cy.get('.el-upload__input')
                      .upload({
                        fileContent,
                        fileName,
                        mimeType: 'image/jpeg'
                      })
                  })
                })
              })
            cy.get('.support-item')
              .get('.support-input')
              .type('20 - 5')
            cy.get('.info-item')
              .get('.info-input')
              .type('Open hour: 10:00am - 22:00pm')
            cy.screenshot('backend-add-seller')
            cy.get('.add-btn')
              .click()
          })
        cy.wait(20000)
        cy.get('tbody')
          .find('tr')
          .should('have.length', 5)
      })
      it('cleans the seller table when reset is clicked', () => {
        cy.get('.add-wrapper').get('.seller-table')
          .within(() => {
            cy.get('.name')
              .type('Chinese Restaurant')
            cy.get('.desc')
              .type('Self delivery')
            cy.get('.delivery')
              .type('34')
            cy.get('.bulletin')
              .type('Providing with special Chinese food')
            const fileName = 'seller_avatar_256px.jpg'
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
            const pics = [
              'seller_pics_0.jpg',
              'seller_pics_1.jpg',
              'seller_pics_2.jpg',
              'seller_pics_3.jpg'
            ]
            cy.get('.upload-wrapper')
              .eq(1)
              .within(() => {
                pics.forEach((pic) => {
                  let fileName = pic
                  cy.fixture(fileName).then(fileContent => {
                    cy.get('.el-upload__input')
                      .upload({
                        fileContent,
                        fileName,
                        mimeType: 'image/jpeg'
                      })
                  })
                })
              })
            cy.get('.support-item')
              .get('.support-input')
              .type('20 - 5')
            cy.get('.info-item')
              .get('.info-input')
              .type('Open hour: 10:00am - 22:00pm')
            cy.get('.reset-btn')
              .click()
            cy.get('.name')
              .should('have.value', '')
            cy.get('.desc')
              .should('have.value', '')
            cy.get('.delivery')
              .should('have.value', '')
            cy.get('.bulletin')
              .should('have.value', '')
          })
      })
    })
    describe('Cancel', () => {
      it('redirects to the sellers list page and leaves the sellers list unchanged when cancel is clicked', () => {
        cy.get('.add-wrapper')
          .get('.seller-table')
          .get('.cancel-btn')
          .click()
        cy.wait(5000)
        cy.get('tbody')
          .find('tr')
          .should('have.length', 5)
      })
    })
  })
})
