describe('Crear producto y mercaderia', () => {
  it('No deberia permitir hacer click al boton de guardar si el formulario es invalido.', () => {
    cy.visit('http://localhost:4200/auth/login');
    
    cy.get("#loginUsername").type("adminJorge");
    cy.get("#loginPassword").type("Pa$$word123");

    cy.get("#login").click();
    cy.url().should('include', '/home');

    cy.get("#navProductos").click();
    cy.get("#nuevoProducto").click();

    cy.get("#guardarProducto").should("be.disabled");
  });

  const nombre = "Test";
  
  it('Deberia permitir crear el nuevo producto si el formulario es valido.', () => {
    cy.visit('http://localhost:4200/auth/login');
    
    cy.get("#loginUsername").type("adminJorge");
    cy.get("#loginPassword").type("Pa$$word123");

    cy.get("#login").click();
    cy.url().should('include', '/home');

    cy.get("#navProductos").click();
    cy.get("#nuevoProducto").click();
    
    cy.get("#nombre").type(nombre);
    cy.get("#image").selectFile("src/assets/img/placeholder-image.png");
    cy.get("#categoria").select(5);
    cy.get("#descripcion").type("Test para la descripcion.");
    cy.get("#proveedor").select(2);
    cy.get("#precio").type("15");
    cy.get("#costo").type("13");

    cy.get("#guardarProducto").should("be.enabled");

    cy.get("#guardarProducto").click();

    cy.url().should("include", "/admin/productos");

    cy.get(`#${nombre}`).should("exist");
  });

  it("Deberia de permitir pedir mercancia del producto creado", () => {
    cy.visit('http://localhost:4200/auth/login');
    
    cy.get("#loginUsername").type("adminJorge");
    cy.get("#loginPassword").type("Pa$$word123");

    cy.get("#login").click();
    cy.url().should('include', '/home');

    cy.get("#navProductos").click();
    cy.get(`#${nombre}merca`).should("exist");
    cy.get(`#${nombre}merca`).click();

    cy.get("#ingresoMercaderia").click();

    cy.get("#unidadesMercaderia").clear();
    cy.get("#unidadesMercaderia").type("5");
    
    cy.get("#confirmarMercaderia").click();

    cy.get("#noIngresos").should("not.exist");

  });

  it("Deberia permitir eliminar el producto.", () => {
    cy.visit('http://localhost:4200/auth/login');
    
    cy.get("#loginUsername").type("adminJorge");
    cy.get("#loginPassword").type("Pa$$word123");

    cy.get("#login").click();
    cy.url().should('include', '/home');

    cy.get("#navProductos").click();

    cy.get(`#${nombre}`).should("exist");
    
    cy.get(`#${nombre}eliminar`).should("exist");
    cy.get(`#${nombre}eliminar`).click();
    
    cy.get("#confirm").click();
    cy.get(`#${nombre}`).should("not.exist");
    
  });

});