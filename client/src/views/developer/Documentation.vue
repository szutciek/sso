<template>
  <div class="container mW1200">
    <h1>Integration</h1>

    <div class="section">
      <h2>Creating a Developer Account</h2>
      <ul>
        <li>
          Create a normal user account
          <a href="/register" target="_blank">here</a>.
        </li>
        <li>
          Send a POST request to the api endpoint <a>/api/developers/me</a> to
          create & link a developer account.
        </li>
      </ul>
    </div>

    <div class="section">
      <h2>Creating an App</h2>
      <p>Use a REST API client such as Postman for the following steps.</p>
      <ul>
        <li>
          Send a POST request to <a>/api/apps</a> while logged in to a developer
          account, with the following JSON body:
        </li>
        <ul>
          <li>name: the (display) name of your app.</li>
          <li>clientId: the identificator of the client.</li>
          <li>
            redirectUris: array of allowed addresses that users can be
            redirected to.
          </li>
          <li>
            redirectUrisDevelopment: array of allowed addresses that users can
            be redirected to, but with development-only tokens.
          </li>
          <li>
            scope: array of user data (fields) to be shared and included in
            token payloads:
          </li>
          <ul>
            <li>profile</li>
            <li>username</li>
            <li>email</li>
            <li>birthday</li>
            <li>gender</li>
            <li>locale</li>
            <li>language</li>
          </ul>
        </ul>
      </ul>
    </div>

    <div class="section">
      <h2>Integrating OAuth2</h2>
      <p>Use a REST API client such as Postman for the following steps.</p>
      <ul>
        <li>
          Upon starting the login flow, redirect the clients browser to
          <a>/authorize</a> (GET request) with the following query:
        </li>
        <ul>
          <li>response_type: currently only "token" supported.</li>
          <li>client_id: the client_id of your app.</li>
          <li>
            redirect_uri: the (submitted with app creation) address to which the
            client gets redirected upon success.
          </li>
          <li>
            state: a random string of characters that will be in the query after
            the user is redirected (save for verification).
          </li>
        </ul>
        <li>
          After being redirected, the access_token and scope will be available
          in the query.
        </li>
        <li>
          Recommended modules exposing methods for validating the validity of
          the token is available to download at:
        </li>
        <ul>
          <li>
            CommonJS:
            <a
              href="https://assets.kanapka.eu/modules/KanapkaSSO.common.js"
              target="_blank"
              >KanapkaSSO.common.js</a
            >
          </li>
          <li>
            ES6:
            <a
              href="https://assets.kanapka.eu/modules/KanapkaSSO.mjs"
              target="_blank"
              >KanapkaSSO.mjs</a
            >
          </li>
        </ul>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding-top: 40px;
  padding-bottom: 300px;
  width: 100%;
}
.container h1 {
  font-size: 32px;
  font-weight: 800;
}

.section {
  padding-top: 40px;
}
.section h2 {
  font-size: 20px;
  font-weight: 600;

  margin-bottom: 20px;
}
.section p {
  font-size: 16px;
  font-weight: 400;
}
.section ul {
  margin-left: 32px;
}
.section li {
  font-size: 16px;
}
.section a {
  text-decoration: underline;
}
</style>
