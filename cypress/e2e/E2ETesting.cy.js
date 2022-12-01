/// <reference types="cypress" />

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function justDateString(date) {
    return date.toISOString().split('T')[0]
}

describe('End to end testing of Light-Dark Mode site', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/')
    })

    it('Testing Create your custom countdown', () => {
        cy.get('label[for="title"]').should('have.text', 'Title')
        cy.get('label[for="date-picker"]').should('have.text', 'Select a Date ! ')
        cy.get('#title').type('Bala')
        cy.get('#countdownForm > button').click()
        cy.on('window:alert', (txt) => {
            //Assertion
            expect(txt).to.contains('Please select a date !');
        })
        const today = new Date();
        const yesterday = addDays(today, -1)
        cy.get('#date-picker').type(justDateString(yesterday))
        cy.get('#countdownForm > button').click() //It should not do anything because the date is not right
        cy.get('#date-picker').type(justDateString(today)) //add today's day
        cy.get('#countdownForm > button').click()
        cy.get('.complete-title').should('have.text', 'Countdown Completed !')
        cy.get('#complete-button').click()  //back to home page
        cy.get('#input-container > h1').should('have.text', 'Create Your Custom Countdown ! ')
        const tomorrow = addDays(today, 1)
        cy.get('#date-picker').type(justDateString(tomorrow)) // add tomorrow
        cy.get('#countdownForm > button').click().should(() => {
            expect(localStorage.getItem('countdown')).to.exist  //assert that local storage was made
        })
        cy.get('#countdown-title').should('have.text', 'Bala')
        cy.get('#countdown-button').click().should(() => {      //back to home page
            expect(localStorage.getItem('countdown')).to.not.exist  //assert that localstorage was removed
        })
        cy.get('#input-container > h1').should('have.text', 'Create Your Custom Countdown ! ')
    })


})