const PasswordRecoveryTemplate = (token) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        background-color: #010101;
      }

      #main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        width: 100%;
        height: 100vh;
        max-height: 40rem;
        padding: 2rem 5rem;
        gap: 1rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
          sans-serif;
      }
      .main__title {
        font-weight: bold;
      }
      .main__section-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .main__section-container--subtitle {
        margin-bottom: 1rem;
        font-weight: 600;
      }
      .section-container__button-container {
        margin-top: 1rem;
      }
      .button-container__button {
        color: #fff;
        text-decoration: none;
        background-color: #09f;
        padding: 0.5rem 1.5rem;
        border-radius: 0.25rem;
      }
      .section-container--minitext {
        margin-top: 0.5rem;
        font-weight: 300;
        color: #aaa;
      }
    </style>
  </head>
  <body>
    <main class="main" id="main">
      <h1 class="main__title">Ecommerce App</h1>
      <section class="main__section-container">
        <h3 class="main__section-container--subtitle">
          Looks like you requested a email to reset your password, click on the
          button to change it
        </h3>
        <div class="section-container__button-container">
          <a
            href="http://localhost:3001/api/v1/auth/password-recovery/verify?t=${token}"
            target="_blank"
            rel="noreferrer noopener"
            class="button-container__button"
            >Reset Your Password</a
          >
        </div>
        <small class="section-container--minitext"
          >If you do not requested this recovery link, ignore it</small
        >
      </section>
    </main>
  </body>
</html>
`;

module.exports = {
  PasswordRecoveryTemplate,
};
