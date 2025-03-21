describe('Metodos de pago', () => {
  it('Deberia rechazar una tarjeta invalida.', () => {
    cy.visit('http://localhost:4200/auth/login');

    cy.get("#loginUsername").type("pereznator");
    cy.get("#loginPassword").type("Pa$$word123");
    
    cy.get("#login").click();
    cy.url().should('include', '/home');
    
    cy.visit('http://localhost:4200/cliente/metodos-pago');
    
    cy.get("#nuevoMetodoPago").click();
    cy.url().should('include', '/cliente/metodos-pago/nuevo');

    cy.get("#opTarjeta").click();

    cy.get("#tarjetaNum").type("1234567812345678");
    cy.get("#mesExp").type("02");
    cy.get("#yearExp").type("2021");
    cy.get("#cvv").type("123");

    cy.get("#agregarTarjeta").click();
    cy.get("#invalidYear").should("be.visible");
  });

  it("Deberia permitir la creacion de un metodo de pago con tarjeta.", () => {
    cy.visit('http://localhost:4200/auth/login');

    cy.get("#loginUsername").type("pereznator");
    cy.get("#loginPassword").type("Pa$$word123");
    
    cy.get("#login").click();
    cy.url().should('include', '/home');

    cy.visit('http://localhost:4200/cliente/metodos-pago');
    
    cy.get("#nuevoMetodoPago").click();
    cy.url().should('include', '/cliente/metodos-pago/nuevo');

    cy.get("#opTarjeta").click();

    cy.get("#tarjetaNum").type("1234567812345678");
    cy.get("#mesExp").type("02");
    cy.get("#yearExp").type("2025");
    cy.get("#cvv").type("123");

    cy.get("#agregarTarjeta").click();

    cy.get("#1234567812345678").should("exist");

  });
  
  
  it("Deberia permitir eliminar la tarjeta que se acaba de agregar.", () => {
    cy.visit('http://localhost:4200/auth/login');

    cy.get("#loginUsername").type("pereznator");
    cy.get("#loginPassword").type("Pa$$word123");
    
    cy.get("#login").click();
    cy.url().should('include', '/home');

    cy.visit('http://localhost:4200/cliente/metodos-pago');


    cy.get("#1234567812345678").should("exist");
    
    cy.get("#1234567812345678").click();
    
    cy.get("#confirm").click();
    
    
    cy.get("#1234567812345678").should("not.exist");

  });


});