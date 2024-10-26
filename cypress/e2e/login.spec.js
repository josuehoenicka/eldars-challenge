describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("debería mostrar el formulario de login", () => {
    cy.get("form").should("be.visible");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
  });

  it("debería mostrar un mensaje de error con credenciales inválidas", () => {
    cy.get('input[name="email"]').type("wrong@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.contains("El email y/o contraseña son incorrectos").should("be.visible");
  });

  it("debería navegar al área de productos con credenciales válidas", () => {
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/products");
  });
});
