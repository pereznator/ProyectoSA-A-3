describe('Validar pagos y actualizacion de estado.', () => {
  it('Deberia permitir actualizar de estado las ordenes pendientes.', () => {
    cy.visit('http://localhost:4200/auth/login');
    
    cy.get("#loginUsername").type("adminJorge");
    cy.get("#loginPassword").type("Pa$$word123");

    cy.get("#login").click();
    cy.url().should('include', '/home');

    cy.get("#pedidos").click();

    let correlativo: string;
    cy.get("#0correlativo").invoke("text").then(text => {
      correlativo = text;
    
      cy.log("CORRELATIVO", correlativo);

      cy.get(`#0autorizar`).click();
  
      cy.get("#confirm").click();
  
      cy.get("#tipoPedidos").select(1);

      // Validar que el correlativo buscado existe en la tabla
      cy.contains('table.table tbody tr td:nth-child(1)', correlativo).should('exist');


      
      cy.get(`#${correlativo}entregar`).click();
      cy.get("#confirm").click();
  
      cy.get("#tipoPedidos").select(3);
  
      cy.contains('table.table tbody tr td:nth-child(1)', correlativo).should('exist');
    });
  });
});
