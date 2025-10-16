describe('顧客情報入力フォームのテスト', () => {
  it('顧客情報を入力して送信し、成功メッセージを確認する', () => {
    cy.visit('/akiha_kadohama/customer/add.html'); // テスト対象のページにアクセス

    // テストデータの読み込み
    cy.fixture('customerData').then((data) => {
      // フォームの入力フィールドにテストデータを入力
      const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      cy.get('#companyName', { timeout: 10000 }).should('exist').type(data.companyName);
      cy.get('#industry', { timeout: 10000 }).should('exist').type(data.industry);
      cy.get('#contact', { timeout: 10000 }).should('exist').type(uniqueContactNumber);
      cy.get('#location', { timeout: 10000 }).should('exist').type(data.location);
    });

    // フォームの送信
    cy.get('#customer-form').submit();

    // 確認ページに遷移するはずなので、そのURLを確認
    cy.url({ timeout: 10000 }).should('include', 'add-confirm.html');

    cy.window().then((win) => {3
    // windowのalertをスタブ化し、エイリアスを設定
      cy.stub(win, 'alert').as('alertStub');
    });

    // 確認ページで保存ボタンをクリック
    cy.get('#save-btn').click();    

    cy.get('@alertStub').should('have.been.calledOnceWith', '保存が完了しました！');

  });
});