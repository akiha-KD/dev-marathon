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


describe('顧客情報入力フォーム入力済みの値確認テスト', () => {
  it('入力・登録した会社名と連絡先が一覧画面に表示されることを確認する', () => {
    cy.visit('/akiha_kadohama/customer/add.html'); // 入力ページにアクセス

    // 一意な値を作っておく（後でリスト画面で検証するため）
    const uniqueCompanyName = `テスト会社_${Date.now()}`;
    const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // fixtureのテストデータを利用して入力
    cy.fixture('customerData').then((data) => {
      cy.get('#companyName', { timeout: 10000 }).should('exist').type(uniqueCompanyName);
      cy.get('#industry', { timeout: 10000 }).should('exist').type(data.industry);
      cy.get('#contact', { timeout: 10000 }).should('exist').type(uniqueContactNumber);
      cy.get('#location', { timeout: 10000 }).should('exist').type(data.location);
    });

    // フォーム送信 → 確認ページへ
    cy.get('#customer-form').submit();
    cy.url({ timeout: 10000 }).should('include', 'add-confirm.html');

    // alertのスタブを設定
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    // 保存ボタンクリック
    cy.get('#save-btn').click();

    // 「保存が完了しました！」アラートが呼ばれたか確認
    cy.get('@alertStub').should('have.been.calledOnceWith', '保存が完了しました！');

    // list.html へ遷移しているか確認
    cy.url({ timeout: 10000 }).should('include', '/akiha_kadohama/customer/list.html');

    // 登録した会社名と連絡先が一覧に表示されているか確認
    cy.contains(uniqueCompanyName).should('exist');
    cy.contains(uniqueContactNumber).should('exist');


  });
  });
  it('登録した顧客を詳細画面で削除し、一覧に表示されないことを確認する', () => {
    let uniqueCompanyName;
    let uniqueContactNumber;

    // fixtureから基本データを取得して登録
    cy.fixture('customerData').then((data) => {
      uniqueCompanyName = `テスト会社_${Date.now()}`;
      uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 登録ページにアクセス
      cy.visit('/akiha_kadohama/customer/add.html');

      cy.get('#companyName', { timeout: 10000 }).should('exist').type(uniqueCompanyName);
      cy.get('#industry').should('exist').type(data.industry);
      cy.get('#contact').should('exist').type(uniqueContactNumber);
      cy.get('#location').should('exist').type(data.location);

      // フォーム送信
      cy.get('#customer-form').submit();

      // alert スタブ化して保存完了確認
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('saveAlert');
      });
      cy.get('#save-btn').click();
      cy.get('@saveAlert').should('have.been.calledWith', '保存が完了しました！');

      // 少し待機して一覧画面に遷移
      cy.wait(500);
      cy.visit('/akiha_kadohama/customer/list.html');

      // 登録された会社名と連絡先が表示されていることを確認
      cy.contains('#customer-list tr', uniqueCompanyName).should('exist');
      cy.contains('#customer-list tr', uniqueContactNumber).should('exist');

      // 詳細ページへ移動
      cy.contains('#customer-list tr a', uniqueCompanyName).click();

      // 削除ボタン押下
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('deleteAlert');
      });
      cy.get('#delete-btn').click();

      // 削除完了アラートを確認
      cy.get('@deleteAlert').should('have.been.calledWith', '削除が完了しました！');

      // 削除後、一覧画面で存在しないことを確認
      cy.url().should('include', '/akiha_kadohama/customer/list.html');
      cy.contains('#customer-list tr', uniqueCompanyName).should('not.exist');
      cy.contains('#customer-list tr', uniqueContactNumber).should('not.exist');
    });
  });

    });

