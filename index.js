const axios = require("axios");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const nodemailer = require("nodemailer");

const twit = require("twit");
const appConfig = require("./app-config");

// DATASOURCE pages ##########

let targets = [
  {
    name: "RX 6900 XT - Gigabyte",
    type: "Gpu",
    url:
      "https://www.scan.co.uk/products/gigabyte-radeon-rx-6900-xt-16gb-gddr6-ray-tracing-graphics-card-rdna2-5120-streams-2015mhz-gpu-2250m",
    retailer: "ScanUk",
  },
  {
    name: "RX 6900 XT - ASRock",
    type: "Gpu",
    url:
      "https://www.scan.co.uk/products/asrock-radeon-rx-6900-xt-16gb-gddr6-ray-tracing-graphics-card-rdna2-5120-streams-2015mhz-gpu-2250mhz",
    retailer: "ScanUk",
  },
  {
    name: "RX 6900 XT - Sapphire",
    type: "Gpu",
    url:
      "https://www.scan.co.uk/products/sapphire-radeon-rx-6900-xt-16gb-gddr6-ray-tracing-graphics-card-rdna2-5120-streams",
    retailer: "ScanUk",
  },
  {
    name: "RX 6900 XT - Powercolor",
    type: "Gpu",
    url:
      "https://www.scan.co.uk/products/powercolor-radeon-rx-6900-xt-16gb-gddr6-ray-tracing-graphics-card-rdna2-5120-streams",
    retailer: "ScanUk",
  },
  {
    name: "RX 6900 XT - ASUS",
    type: "Gpu",
    url:
      "https://www.scan.co.uk/products/asus-radeon-rx-6900-xt-16gb-gddr6-ray-tracing-graphics-card-rdna2-5120-streams",
    retailer: "ScanUk",
  },
  {
    name: "RX 6800 - SAPPHIRE",
    type: "Gpu",
    url:
      "https://www.overclockers.co.uk/sapphire-radeon-rx-6800-mba-16gb-gddr6-pci-express-graphics-card-very-limited-stock-gx-399-sp.html",
    retailer: "OcUk",
  },
  {
    name: "RX 6800 - PowerColor",
    type: "Gpu",
    url:
      "https://www.overclockers.co.uk/powercolor-radeon-rx-6800-mba-16gb-gddr6-pci-express-graphics-card-very-limited-stock-gx-19r-pc.html",
    retailer: "OcUk",
  },
  {
    name: "RX 6800 XT - PowerColor",
    type: "Gpu",
    url:
      "https://www.overclockers.co.uk/powercolor-radeon-rx-6800-xt-mba-16gb-gddr6-pci-express-graphics-card-very-limited-stock-gx-19q-pc.html",
    retailer: "OcUk",
  },
  {
    name: "RX 6800 XT - SAPPHIRE",
    type: "Gpu",
    url:
      "https://www.overclockers.co.uk/sapphire-radeon-rx-6800-xt-mba-16gb-gddr6-pci-express-graphics-card-very-limited-stock-gx-398-sp.html",
    retailer: "OcUk",
  },
  {
    name: "RYZEN 5 5600X",
    type: "CPU",
    url:
      "https://www.overclockers.co.uk/amd-ryzen-5-5600x-six-core-4.6ghz-socket-am4-processor-retail-cp-3cc-am.html",
    retailer: "OcUk",
  },
  {
    name: "RYZEN 7 5800X",
    type: "CPU",
    url:
      "https://www.overclockers.co.uk/amd-ryzen-7-5800x-eight-core-4.7ghz-socket-am4-processor-retail-cp-3cb-am.html",
    retailer: "OcUk",
  },
  {
    name: "RYZEN 9 5900X",
    type: "CPU",
    url:
      "https://www.overclockers.co.uk/amd-ryzen-9-5900x-twelve-core-4.8ghz-socket-am4-processor-retail-cp-3ca-am.html",
    retailer: "OcUk",
  },
  {
    name: "RX 6800 XT - SAPPHIRE",
    type: "Gpu",
    url:
      "https://www.scan.co.uk/products/sapphire-radeon-rx-6800-xt-16gb-gddr6-ray-tracing-graphics-card-7nm-rdna2-4608-streams-2015mhz",
    retailer: "ScanUk",
  },
  {
    name: "RX 6800 XT - PowerColor",
    type: "Gpu",
    url:
      "https://www.scan.co.uk/products/powercolor-radeon-rx-6800-xt-16gb-gddr6-ray-tracing-graphics-card-7nm-rdna2-4608-streams",
    retailer: "ScanUk",
  },
  {
    name: "RX 6800 - MSI",
    type: "Gpu",
    url:
      "https://www.scan.co.uk/products/msi-radeon-rx-6800-16gb-gddr6-ray-tracing-graphics-card-7nm-rdna2-3840-streams-1700mhz-gpu",
    retailer: "ScanUk",
  },
  {
    name: "RX 6800 - PowerColor",
    type: "Gpu",
    url:
      "https://www.scan.co.uk/products/powercolor-radeon-rx-6800-16gb-gddr6-ray-tracing-graphics-card-7nm-rdna2-3840-streams",
    retailer: "ScanUk",
  },
  {
    name: "RYZEN 9 5900X",
    type: "CPU",
    url:
      "https://www.cclonline.com/product/331767/100-100000061WOF/CPU-Processors/AMD-Ryzen-9-5900X-3-7GHz-Dodeca-Core-Processor-with-12-Cores-24-Threads-105W-TDP-70MB-Cache-4-8GHz-Turbo-No-Cooler/CPU0681/",
    retailer: "CCL",
  },
  {
    name: "RYZEN 7 5800X",
    type: "CPU",
    url:
      "https://www.cclonline.com/product/331766/100-100000063WOF/CPU-Processors/AMD-Ryzen-7-5800X-3-8GHz-Octa-Core-Processor-with-8-Cores-16-Threads-105W-TDP-36MB-Cache-4-7GHz-Turbo-No-Cooler/CPU0680/",
    retailer: "CCL",
  },
  {
    name: "RTX 3080 FE",
    type: "Gpu",
    url:
      "https://www.nvidia.com/en-gb/shop/geforce/gpu/?page=1&limit=9&locale=en-gb&category=GPU&gpu=RTX%203080",
    retailer: "Nvidia",
  },
  {
    name: "Ryzen 9 5900X",
    type: "CPU",
    url:
      "https://www.currys.co.uk/gbuk/computing-accessories/components-upgrades/processors/amd-ryzen-9-5900x-processor-10216689-pdt.html",
    retailer: "Currys",
  },
  {
    name: "Ryzen 7 5800X",
    type: "CPU",
    url:
      "https://www.currys.co.uk/gbuk/computing-accessories/components-upgrades/processors/amd-ryzen-7-5800x-processor-10216690-pdt.html",
    retailer: "Currys",
  },
  {
    name: "Ryzen 5 5600X",
    type: "CPU",
    url:
      "https://www.currys.co.uk/gbuk/computing-accessories/components-upgrades/processors/amd-ryzen-5-5600x-processor-10216691-pdt.html",
    retailer: "Currys",
  },
  {
    name: "Ryzen 5 5600X",
    type: "CPU",
    url:
      "https://www.novatech.co.uk/products/amd-ryzen-5-5600x-six-core-processorcpu-with-stealth-cooler-/100-000000065box.html",
    retailer: "NovaUk",
  },
  {
    name: "Ryzen 7 5800X",
    type: "CPU",
    url:
      "https://www.novatech.co.uk/products/amd-ryzen-7-5800x-eight-core-processorcpu-without-cooler-/100-000000063wof.html",
    retailer: "NovaUk",
  },
  {
    name: "Ryzen 9 5900X",
    type: "CPU",
    url:
      "https://www.novatech.co.uk/products/amd-ryzen-9-5900x-twelve-core-processorcpu-without-cooler-/100-100000061wof.html",
    retailer: "NovaUk",
  },
  {
    name: "Ryzen 5 5600X",
    type: "CPU",
    url:
      "https://www.box.co.uk/100-100000065BOX-AMD-Ryzen-5-5600X-(Socket-AM4)-Processor_3213590.html",
    retailer: "BoxUk",
  },
];

let testTargets = [
  {
    name: "TEST | RADEON RX 5600 XT PULSE",
    type: "Gpu",
    url:
      "https://www.overclockers.co.uk/sapphire-radeon-rx-5600-xt-pulse-6144mb-14gbps-gddr6-pci-express-graphics-card-gx-396-sp.html",
    retailer: "OcUk",
  },
  {
    name: "TEST | PowerColor Red Devil AMD Radeon RX 5700 XT",
    type: "Gpu",
    url:
      "https://www.scan.co.uk/products/powercolor-radeon-rx-5700-xt-red-devil-8gb-gddr6-pcie-40-gpu-7nm-rdna-2560-streams-1770mhz-gpu-2010m",
    retailer: "ScanUk",
  },
  {
    name: "TEST | Ryzen 7 3800X",
    type: "CPU",
    url:
      "https://www.currys.co.uk/gbuk/computing-accessories/components-upgrades/processors/amd-ryzen-7-3800x-processor-10194807-pdt.html?intcmpid=display~RR",
    retailer: "Currys",
  },
  {
    name: "TEST | Ryzen 5 3600XT",
    type: "CPU",
    url:
      "https://www.box.co.uk/AMD-Ryzen-5-3600XT-(Socket-AM4)-Processo_2964025.html",
    retailer: "BoxUk",
  },
];

// DATASOURCE ENDS ##########

// TWITTER CONFIGURATION ##########
let tConfig = {
  consumer_key: appConfig.twitter.CONSUMER_KEY,
  consumer_secret: appConfig.twitter.CONSUMER_SECRET,
  access_token: appConfig.twitter.ACCESS_TOKEN,
  access_token_secret: appConfig.twitter.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 100,
  strictSSL: true,
};
let T = new twit(tConfig);
let sendTweet = (data) => {
  try {
    T.post("statuses/update", { status: data }, function (err, data, response) {
      console.log(data);
    });
  } catch (err) {
    console.log(err);
  }
};
// TWITTER END ###############

// MAIN FUNCTION !!!!
const checkTargets = () => {
  try {
    // use the test data set to check for products to ensure all is working.
    if (appConfig.TEST_APP == "true") targets = testTargets;

    // Loop through ALL the target products!
    for (let i = 0; i < targets.length; i++) {
      const ctx = targets[i];

      // query the web page.
      request(
        {
          uri: ctx.url,
        },
        function (error, response, page) {
          switch (ctx.retailer) {
            case "OcUk":
              saveResponseOc(page, ctx);
              break;
            case "ScanUk":
              saveResponseScan(page, ctx);
              break;
            case "NovaUk":
              saveResponseNovatech(page, ctx);
              break;
            case "BoxUk":
              saveResponseBox(page, ctx);
              break;
            case "CCL":
              saveResponseCCL(page, ctx);
              break;
            case "Nvidia":
              saveResponseNvidia(page, ctx);
              break;
            case "Currys":
              saveResponseCurrys(page, ctx);
              break;
            default:
              break;
          }
        }
      );
    }
    console.log(`${getCurrentDate()} | Done!`);
  } catch (err) {
    console.log(err);
    sendTweet("Check target failed!");
  }
};
// END MAIN FUNCTION
const saveResponseOc = (page, ctx) => {
  try {
    data = [];
    const $ = cheerio.load(page);

    let initialResult = $("#comingsoonDetails")[0];
    // possibly, in stock...
    if (typeof initialResult === "undefined") {
      let secondResult = $(".sAddToBasketButton")[0];
      // in stock!
      if (typeof secondResult !== "undefined") {
        handleProductFound(ctx);
      }
    } else {
    }
  } catch (err) {
    let msg = `${ctx.name} \n ${ctx.url}`;
    console.log(msg);
    console.log(err);
  }
};
const saveResponseScan = (page, ctx) => {
  try {
    data = [];
    const $ = cheerio.load(page);

    let initialResult = $(".rightColumn .buyButtonNoPrice")[0];
    // possibly, in stock...
    if (typeof initialResult === "undefined") {
      let secondResult = $(".rightColumn .buyButton")[0];
      // in stock!
      if (typeof secondResult !== "undefined") {
        handleProductFound(ctx);
      }
    } else {
    }
  } catch (err) {
    let msg = `${ctx.name} \n ${ctx.url}`;
    console.log(msg);
    console.log(err);
  }
};
const saveResponseNovatech = (page, ctx) => {
  try {
    data = [];
    const $ = cheerio.load(page);

    let initialResult = $(".alert.alert-danger")[0];
    // possibly, in stock...
    if (typeof initialResult === "undefined") {
      let secondResult = $(".basket-button.green-solid")[0];
      // in stock!
      if (typeof secondResult !== "undefined") {
        handleProductFound(ctx);
      }
    } else {
    }
  } catch (err) {
    let msg = `${ctx.name} \n ${ctx.url}`;
    console.log(msg);
    console.log(err);
  }
};
const saveResponseBox = (page, ctx) => {
  try {
    data = [];
    const $ = cheerio.load(page);

    let initialResult = $(".btn.grey.pop-reminder")[0];
    // possibly, in stock...
    if (typeof initialResult === "undefined") {
      let secondResult = $(".p-buy.green.btn")[0];
      // in stock!
      if (typeof secondResult !== "undefined") {
        handleProductFound(ctx);
      }
    } else {
    }
  } catch (err) {
    let msg = `${ctx.name} \n ${ctx.url}`;
    console.log(msg);
    console.log(err);
  }
};
const saveResponseCCL = (page, ctx) => {
  try {
    data = [];
    const $ = cheerio.load(page);

    let initialResult = $("#pnlSoldOut")[0];
    // possibly, in stock...
    if (typeof initialResult === "undefined") {
      let secondResult = $("#btnAddToBasket")[0];
      // in stock!
      if (typeof secondResult !== "undefined") {
        handleProductFound(ctx);
      }
    } else {
    }
  } catch (err) {
    let msg = `${ctx.name} \n ${ctx.url}`;
    console.log(msg);
    console.log(err);
  }
};
const saveResponseNvidia = (page, ctx) => {
  // todo later...
};
const saveResponseCurrys = (page, ctx) => {
  try {
    data = [];
    const $ = cheerio.load(page);
    let initialResult = $("li.nostock")[0];
    // possibly, in stock...
    if (typeof initialResult === "undefined") {
      let secondResult = $(".check-delivery-options")[0];
      // in stock!
      if (typeof secondResult !== "undefined") {
        handleProductFound(ctx);
      }
    } else {
    }
  } catch (err) {
    let msg = `${ctx.name} \n ${ctx.url}`;
    console.log(msg);
    console.log(err);
  }
};
const handleProductFound = (ctx) => {
  let twitterMessage = `${ctx.name} \n ${ctx.url}`;
  let logMessage = `${getCurrentDate()} | ${ctx.name} | ${ctx.url} `;

  // only send tweet when app is live!
  if (appConfig.TEST_APP == "false") sendTweet(twitterMessage);

  saveToFile(logMessage);
  console.log(logMessage);
};
const saveToFile = (data) => {
  fs.appendFile("log.txt", "\n " + data, function (err) {});
};
const getCurrentDate = () => {
  var d = new Date(); // for now
  let hour = d.getHours(); // => 9
  let min = d.getMinutes(); // =>  30
  let sec = d.getSeconds(); // => 51

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  return `${today} | ${hour}:${min}:${sec}`;
};

// START THE APP
if (appConfig.ENABLE_APP == "true") {
  setInterval(() => {
    checkTargets();
  }, 60000);
}

// 120000
// Nvidia
// $('.featured-buy-link')[0].text()
// .stock-grey-out
