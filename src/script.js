import web3auth from "@/constants.js";
import { ADAPTER_EVENTS } from "@web3auth/base";
import { WALLET_ADAPTERS } from "@web3auth/base";
import Web3 from "web3";
import jQuery from "jquery";
const $ = jQuery;

const loginViaGoogle = async () => {
  await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
    loginProvider: "google",
  });
};

const loginViaEmail = async (email) => {
  await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
    loginProvider: "email_passwordless",
    extraLoginOptions: {
      login_hint: email.trim(),
    },
  });
};

function setupWeb3AuthEvents() {
  web3auth.on(ADAPTER_EVENTS.READY, () => {
    console.log("Web3Auth ready");
    uiConsole("Web3Auth ready");
  });

  web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
    console.log("Web3Auth connecting");
    uiConsole("Web3Auth connecting...");
  });

  web3auth.on(ADAPTER_EVENTS.CONNECTED, async () => {
    console.log("Web3Auth connected");
    $(".btn-logged-in").show();
    $(".btn-logged-out").hide();

    // // Get and display initial user data
    // const user = await web3auth.getUserInfo();
    // const web3 = new Web3(web3auth.provider);
    // const address = (await web3.eth.getAccounts())[0];

    uiConsole("Web3Auth Connected");
  });

  web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
    console.log("Web3Auth disconnected");
    $(".btn-logged-in").hide();
    $(".btn-logged-out").show();
    uiConsole("Disconnected");
  });
}

$(document).ready(async function () {
  try {
    $(".btn-logged-in").hide();
    $(".btn-logged-out").hide();

    setupWeb3AuthEvents();
    await web3auth.init();

    if (web3auth.connected) {
      $(".btn-logged-in").show();
    } else {
      $(".btn-logged-out").show();
    }
  } catch (error) {
    console.error(error);
    uiConsole("Error:", error.message);
    $(".btn-logged-out").show();
  }
});

// $("#login").click(async function (event) {
//   try {
//     await web3auth.connectTo("auth", {
//       loginProvider: "google",
//     });
//     $(".btn-logged-out").hide();
//     $(".btn-logged-in").show();
//     uiConsole("Logged in Successfully!");
//   } catch (error) {
//     console.error(error.message);
//   }
// });

$("#login-google").click(async function (event) {
  try {
    await loginViaGoogle();
    $(".btn-logged-out").hide();
    $(".btn-logged-in").show();
    uiConsole("Logged in Successfully with Google!");
  } catch (error) {
    console.error(error.message);
    uiConsole("Error:", error.message);
  }
});

$("#login-email").click(async function (event) {
  try {
    const email = $("#email-input").val();
    if (!email) {
      uiConsole("Error: Please enter an email address");
      return;
    }

    await loginViaEmail(email);
    $(".btn-logged-out").hide();
    $(".btn-logged-in").show();
    uiConsole("Logged in Successfully with Email!");
  } catch (error) {
    console.error(error.message);
    uiConsole("Error:", error.message);
  }
});

$("#get-user-info").click(async function (event) {
  try {
    const user = await web3auth.getUserInfo();
    uiConsole("User Information", user, { jwt: user.idToken });
  } catch (error) {
    console.error(error.message);
  }
});

$("#get-accounts").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole("User address", address);
  } catch (error) {
    console.error(error.message);
  }
});

$("#get-balance").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole("User balance", balance);
  } catch (error) {
    console.error(error.message);
  }
});

$("#get-private-key").click(async function (event) {
  try {
    const privateKey = await web3auth.provider?.request({
      method: "eth_private_key",
    });
    uiConsole("Private key", privateKey);
  } catch (error) {
    console.error(error.message);
  }
});

$("#sign-message").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);
    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole("Signed message", signedMessage);
  } catch (error) {
    console.error(error.message);
  }
});

$("#logout").click(async function (event) {
  try {
    await web3auth.logout();
    $(".btn-logged-in").hide();
    $(".btn-logged-out").show();
  } catch (error) {
    console.error(error.message);
  }
});

// function uiConsole(...args) {
//   const el = document.querySelector("#console>p");
//   if (el) {
//     el.innerHTML = JSON.stringify(args || {}, null, 2);
//     console.log(...args);
//   }
// }

function parseJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
}

function formatOutput(data) {
  return JSON.stringify(data || {}, null, 2)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function uiConsole(title, data = null, options = {}) {
  const consoleEl = document.querySelector("#console");
  const item = document.createElement("div");
  item.className = "console-item";

  // Add title
  const titleEl = document.createElement("h4");
  titleEl.className = "console-title";
  titleEl.textContent = title;
  item.appendChild(titleEl);

  // Add content container
  const contentDiv = document.createElement("div");
  contentDiv.className = "console-content";

  // Main output
  if (data != null) {
    const mainOutput = document.createElement("pre");
    mainOutput.className = "code";
    mainOutput.innerHTML = formatOutput(data);
    contentDiv.appendChild(mainOutput);
  }

  // Add JWT if present in options
  if (options.jwt) {
    const decodedJWT = parseJWT(options.jwt);
    if (decodedJWT) {
      const jwtOutput = document.createElement("pre");
      jwtOutput.className = "code jwt-content";
      jwtOutput.innerHTML = "Decoded JWT:\n" + formatOutput(decodedJWT);
      contentDiv.appendChild(jwtOutput);
    }
  }

  item.appendChild(contentDiv);
  consoleEl.innerHTML = "";
  consoleEl.appendChild(item);
  console.log(title, data);
}
