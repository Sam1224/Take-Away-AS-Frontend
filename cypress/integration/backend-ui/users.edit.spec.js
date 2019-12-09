/**
 * @Author: Sam
 * @Date: 2019/12/9
 * @Version: 1.0
 **/
/* eslint-disable */
let url = 'http://localhost:8080/#/admin/login'
let apiBaseUrl = 'https://takeawayapp-sam.herokuapp.com'

describe ('Test add user page of the backend ui', () => {
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
      .eq(1)
      .click()
    cy.wait(5000)
    cy.get('tbody')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(4)
      .click()
  })
  describe('Content', () => {
    describe('Title', () => {
      it('shows a title', () => {
        cy.get('.edit-wrapper')
          .get('.title')
          .should('contain', 'Edit User')
      })
    })
    describe('User form', () => {
      it('shows a user form with 3 input boxes, 3 lines with symbol + and 2 buttons', () => {
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Username')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Password')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Phone')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Address')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Pay')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Favorite')
      })
    })
  })
  describe('Function', () => {
    describe('Edit', () => {
      describe('Password and phone', () => {
        it('successfully updates password and phone', () => {
          let userTable = cy.get('.edit-wrapper').get('.user-table')
          userTable.get('.password')
            .within(() => {
              cy.get('input')
                .clear()
                .type('123456')
            })
          userTable.get('.phone')
            .within(() => {
              cy.get('input')
                .clear()
                .type('18351818012')
            })
          userTable.get('.edit-btn')
            .click()
          cy.screenshot('backend-edit-user-basic')
          cy.wait(1000)
          cy.get('.home')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(1)
            .click()
          cy.wait(5000)
          cy.get("tbody")
            .find("tr")
            .eq(1)
            .find("td")
            .eq(3)
            .should('contain', "18351818012")
        })
      })
      describe('Address', () => {
        it('successfully add address', () => {
          cy.wait(3000)
          cy.get('.edit-wrapper')
            .get('.user-table')
            .get('.address-item')
            .get('.iconBtn')
            .eq(0)
            .click()
          cy.wait(1000)
          cy.get('.google-map-address-input')
            .type('Riverwalk')
          cy.screenshot('backend-edit-user-add-address')
          cy.get('.google-map-address-select')
            .click()
          cy.wait(1000)
          cy.get('.edit-wrapper')
            .get('.user-table')
            .find('.address-item')
            .should('have.length', 1)
        })
        it('seccessfully delete address', () => {
          cy.wait(3000)
          cy.get('.edit-wrapper')
            .get('.user-table')
            .get('.address-item')
            .get('.iconBtn')
            .eq(0)
            .click()
          cy.screenshot('backend-edit-user-delete-address')
          cy.get('button')
            .contains('Submit')
            .click()
          cy.wait(1000)
          cy.get('.edit-wrapper')
            .get('.user-table')
            .find('.address-item')
            .should('have.length', 1)
        })
      })
      describe('Pay', () => {
        it('successfully add pay', () => {
          cy.wait(3000)
          cy.get('.edit-wrapper')
            .get('.user-table')
            .get('.address-item')
            .get('.iconBtn')
            .eq(1)
            .click()
          cy.wait(1000)
          cy.get('.el-message-box__input')
            .within(() => {
              cy.get('.el-input')
                .get('.el-input__inner')
                .type('622848')
            })
          cy.screenshot('backend-edit-user-add-pay')
          cy.get('button')
            .contains('Submit')
            .click()
          cy.wait(1000)
          cy.get('.edit-wrapper')
            .get('.user-table')
            .find('.pay-item')
            .should('have.length', 1)
        })
        it('seccessfully delete pay', () => {
          cy.wait(3000)
          cy.get('.edit-wrapper')
            .get('.user-table')
            .get('.pay-item')
            .within(() => {
              cy.get('.iconBtn')
                .eq(0)
                .click()
            })
          cy.screenshot('backend-edit-user-delete-pay')
          cy.get('.el-message-box')
            .get('button')
            .contains('Submit')
            .click()
          cy.wait(1000)
          cy.get('.edit-wrapper')
            .get('.user-table')
            .find('.pay-item')
            .should('have.length', 1)
        })
      })
      describe('Favorite', () => {
        it('successfully add favorite', () => {
          cy.wait(3000)
          cy.request(`${apiBaseUrl}/seller`)
            .its('body')
            .then((res) => {
              expect(res.code).to.equal(0)
              let seller = res.data[0]
              cy.get('.edit-wrapper')
                .get('.user-table')
                .get('.favorite-item')
                .get('.iconBtn')
                .eq(2)
                .click()
              cy.wait(1000)
              cy.get('.el-message-box__input')
                .within(() => {
                  cy.get('.el-input')
                    .get('.el-input__inner')
                    .type(seller._id)
                })
              cy.screenshot('backend-edit-user-add-favorite')
              cy.get('button')
                .contains('Submit')
                .click()
              cy.wait(1000)
              cy.get('.edit-wrapper')
                .get('.user-table')
                .find('.favorite-item')
                .should('have.length', 1)
            })
        })
        it('seccessfully delete favorite', () => {
          cy.wait(3000)
          cy.get('.edit-wrapper')
            .get('.user-table')
            .get('.favorite-item')
            .within(() => {
              cy.get('.iconBtn')
                .eq(0)
                .click()
            })
          cy.screenshot('backend-edit-user-delete-favorite')
          cy.get('.el-message-box')
            .get('button')
            .contains('Submit')
            .click()
          cy.wait(1000)
          cy.get('.edit-wrapper')
            .get('.user-table')
            .find('.favorite-item')
            .should('have.length', 1)
        })
      })
    })
    describe('Cancel', () => {
      it('redirects to the users list page and leaves the users list unchanged when cancel is clicked', () => {
        cy.get('.edit-wrapper')
          .get('.user-table')
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
