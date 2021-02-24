describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });
  it("should navigate to Tuesday", () => {
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  });
  it("should book an interview", () => {
    cy.get('[alt="Add"]').first().click();
    cy.get('[alt="Sylvia Palmer"]').click();
    cy.get("[data-testid=student-name-input]").type("Bryce McIssac");
    cy.get(".button--confirm").click();
    cy.get(".appointment__card").should("be.visible");
  });
  it("should edit an interview", () => {
    cy.get('[alt="Edit"]').click({ force: true });
    cy.get('[alt="Tori Malcolm"]').click();
    cy.get("[data-testid=student-name-input]").clear().type("Jay Pritchett");
    cy.get(".button--confirm").click();
    cy.get(".appointment__card").should("be.visible");
  });
  it("should cancel an interview", () => {
    cy.get('[alt="Delete"]').click({ force: true });
    cy.contains("Confirm").click();
    cy.get(":nth-child(1) > .appointment__add").should("be.visible");
  });
});
