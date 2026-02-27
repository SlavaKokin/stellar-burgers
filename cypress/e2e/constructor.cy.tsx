/// <reference types="cypress" />
describe('Интеграционные тесты для страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.fixture('ingredients.json').then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: ingredients
      }).as('getIngredients');
    });
    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', 'api/auth/user', {
        statusCode: 200,
        body: user
      }).as('getUserApi');
    });
    cy.fixture('orders.json').then((order) => {
      cy.intercept('POST', 'api/orders', {
        statusCode: 200,
        body: order
      }).as('createOrder');
    });
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
    cy.window().then((win) => {
      // Установка токенов в localStorage
      win.localStorage.setItem('accessToken', 'mocked-access-token');
      win.localStorage.setItem('refreshToken', 'mocked-refresh-token');
    });
  });

  it('Добавление ингредиентов в конструктор', () => {
    cy.get('[data-cy="ingredient-bun"]')
      .first()
      .parent()
      .within(() => {
        cy.contains('button', 'Добавить').click({ force: true });
      });

    cy.get('[data-cy="ingredient-main"]')
      .first()
      .parent()
      .within(() => {
        cy.contains('button', 'Добавить').click({ force: true });
      });

    cy.get('[data-cy="top-bun"]').should('exist');
    cy.get('[data-cy="bottom-bun"]').should('exist');
    cy.get('[data-cy="main"]').should('exist');
  });

  it('Работа модального окна ингредиента', () => {
    cy.get('[data-cy="ingredient-bun"]')
      .first()
      .parent()
      .find('[data-cy="ingredient-name"]')
      .invoke('text')
      .then((txt) => {
        const ingredientName = txt.trim();

        // открываем модальное окно
        cy.get('[data-cy="ingredient-bun"]')
          .first()
          .parent()
          .within(() => {
            cy.get('a').click({ force: true });
          });

        // ждем появления модального окна
        cy.get('[data-cy="modal"]').should('be.visible');

        // внутри модального окна сравниваем название
        cy.get('[data-cy="ingredient-details-name"]')
          .should('be.visible')
          .and('have.text', ingredientName);

        // закрываем модальное окно на крестик
        cy.get('[data-cy="close-modal"]').click();
      });

    // проверяем закрытие по overlay
    cy.get('[data-cy="ingredient-bun"]')
      .first()
      .parent()
      .within(() => {
        cy.get('a').click({ force: true });
      });
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="close-overlay"]').click({ force: true });
  });

  it('Создание заказа', () => {
    cy.get('[data-cy="ingredient-bun"]')
      .first()
      .parent()
      .within(() => {
        cy.contains('button', 'Добавить').click({ force: true });
      });

    cy.get('[data-cy="ingredient-main"]')
      .first()
      .parent()
      .within(() => {
        cy.contains('button', 'Добавить').click({ force: true });
      });
    cy.get('[data-cy="order-arrange"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('have.text', '101645');
    cy.get('[data-cy="close-modal"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="top-bun"]').should('not.exist');
    cy.get('[data-cy="main"]').should('contain.text', 'Выберите начинку');
    cy.get('[data-cy="top-bun"]').should('not.exist');
  });
});
