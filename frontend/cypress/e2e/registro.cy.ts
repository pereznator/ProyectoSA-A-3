import { v4 } from "uuid";

describe('Registro e Inicio de Sesion', () => {
  it('Deberia de bloquear el boton para registrarse si el formulario esta invalido', () => {
    cy.visit('http://localhost:4200/auth/register');
    cy.get("#image").should("be.empty");
    cy.get("#nombre").should("be.empty");
    cy.get("#apellido").should("be.empty");
    cy.get("#username").should("be.empty");
    cy.get("#direccion").should("be.empty");
    cy.get("#correo").should("be.empty");
    cy.get("#telefono").should("be.empty");
    cy.get("#password").should("be.empty");
    cy.get("#passwordRepeat").should("be.empty");
    cy.get("#btnRegistro").should("be.disabled");
  });
  const id = v4();
  
  it("Deberia permitir el registro de un nuevo usuario", () => {
    cy.visit('http://localhost:4200/auth/register');
    

    cy.get("#nombre").type("test");
    cy.get("#apellido").type("cypress");
    cy.get("#username").type(id);
    cy.get("#direccion").type("una direccion");
    cy.get("#correo").type(`${id}@gmail.com`);
    cy.get("#telefono").type("12345678");
    cy.get("#password").type("Pa$$word123");
    cy.get("#passwordRepeat").type("Pa$$word123");

    cy.get("#image").selectFile("src/assets/img/register-img-placeholder.png");
    // cy.fixture("../../src/assets/img/register-img-placeholder.png", "base64").then(content => {
    // });

    cy.get("#btnRegistro").should("not.be.disabled");
    cy.get("#btnRegistro").click();
    cy.get("#enOtroMomento").click();

    cy.url().should('include', '/auth/login');
  });
  
  it("Deberia permitir hacer login con las credenciales registradas anteriormente", () => {
    cy.visit('http://localhost:4200/auth/login');
    
    cy.get("#loginUsername").type(id);
    cy.get("#loginPassword").type("Pa$$word123");
    
    cy.get("#login").click();
    cy.url().should('include', '/home');
  });
});
