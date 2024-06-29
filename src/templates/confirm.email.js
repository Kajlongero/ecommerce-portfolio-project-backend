const ConfirmEmailTemplate = (token) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirm your email template</title>
    <style>
      body {
        box-sizing: border-box;
        margin: 0;
        background-color: #000;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #000;
      }
      .main {
        background-color: #000;
        margin: 0 auto;
        width: 100%;
        max-width: 37.5rem;
        font-family: sans-serif;
        border-spacing: 0;
        color: #fff;
        padding: 0 1rem;
      }
      .title {
        text-align: center;
        color: #eddede;
        margin-bottom: 1rem;
      }
      .subtitle {
        text-align: center;
        color: #eddede;
      }
      .button {
        color: #fff;
        text-decoration: none;
        background-color: #09f;
        padding: 0.5rem 1.5rem;
        border-radius: 0.25rem;
      }
      .minitext-table {
        margin-top: 0.5rem;
      }
      .minitext-container {
        text-align: center;
      }
      .minitext {
        margin-top: 0.5rem;
        font-weight: 300;
        font-size: 0.75rem;
        color: #aaa;
        text-align: center;
        width: 100%;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <table class="main">
        <tr>
          <td>
            <h1 class="title">KajloCommerce</h1>
          </td>
        </tr>
        <tr>
          <td
            style="display: flex; flex-direction: column; align-items: center"
          >
            <table>
              <tr>
                <td style="text-align: center">
                  <p class="subtitle">
                    Here is your confirmation link for your account
                  </p>
                  <a
                    href="http://localhost:3001/api/v1/user/confirm-email?t=${token}"
                    target="_blank"
                    rel="noreferrer noopener"
                    class="button"
                    >Confirm your email</a
                  >
                </td>
              </tr>
              <tr>
                <td class="minitext-container">
                  <p class="minitext">
                    This email has been sent automatically when you signed up
                  </p>
                </td>
              </tr>
            </table>
            <!-- <table class="icons-container">
              <tr>
                <td>
                  <a href="#"><img src="" alt="" /></a>
                  <a href="#"><img src="" alt="" /></a>
                  <a href="#"><img src="" alt="" /></a>
                  <a href="#"><img src="" alt="" /></a>
                  <a href="#"><img src="" alt="" /></a>
                </td>
              </tr>
            </table> -->
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>

`;

module.exports = {
  ConfirmEmailTemplate,
};
