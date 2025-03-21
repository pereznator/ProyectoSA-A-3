describe('Agregar productos al carrito y crear orden.', () => {
  it('Deberia permitir agregar productos al carrito.', () => {
    cy.visit('http://localhost:4200/auth/login');

    cy.get("#loginUsername").type("pereznator");
    cy.get("#loginPassword").type("Pa$$word123");
    
    cy.get("#login").click();
    cy.url().should('include', '/home');

    cy.get("#buscar").click();
    cy.get("#buscarJuego").type("Red Dead Redemption 2");
    cy.get("#btnBuscar").click();
    cy.get("#0").click();
    cy.get("#agregarAlCarrito").click();
    
    cy.get("#unidadesCarrito").clear();
    cy.get("#unidadesCarrito").type("1");
    
    cy.get("#confirmar").click();
    
    cy.url().should("include", "/cliente/carrito");
    
    cy.get("#crearOrden").click();
    
    cy.get("#seleccionarMetodoPago").select(1);

    cy.get("#confirmarOrden").click();
    cy.get("#confirm").click();
    
    cy.url().should("include", "/cliente/ordenes");
  });
});
