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
    name: "AMD - Radeon",
    type: "Gpu",
    url: "https://www.amd.com/en/where-to-buy/radeon-rx-6000-series-graphics",
    retailer: "AMDproduct",
  },
  {
    name: "AMD - Ryzen",
    type: "CPU",
    url: "https://www.amd.com/en/where-to-buy/ryzen-5000-series-processors",
    retailer: "AMDproduct",
  },
  {
    name: "AMD",
    type: "Gpu",
    url: "https://www.amd.com/en/direct-buy/gb",
    retailer: "AMD",
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
    name: "RYZEN 9 5900X",
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
];

let testTargets = [
  {
    name: "TEST | ADEON RX 5600 XT PULSE",
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
          // console.log(ctx.url);

          switch (ctx.retailer) {
            case "OcUk":
              saveResponseOc(page, ctx);
              break;
            case "ScanUk":
              saveResponseScan(page, ctx);
              break;
            case "NovaUk":
              saveResonseNovatech(page, ctx);
              break;
            case "BoxUk":
              saveResonseBox(page, ctx);
              break;
            case "CCL":
              saveResponseCCL(page, ctx);
              break;
            case "Nvidia":
              saveResponseNvidia(page, ctx);
              break;
            case "AMDproduct":
              saveResponseAMDProduct(page, ctx);
              break;
            case "AMD":
              saveResponseAMD(page, ctx);
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
};
const saveResponseScan = (page, ctx) => {
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
};
const saveResonseNovatech = (page, ctx) => {};
const saveResonseBox = (page, ctx) => {};
const saveResponseCCL = (page, ctx) => {
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
};
const saveResponseNvidia = (page, ctx) => {
  // todo later...
};
const saveResponseAMD = (page, ctx) => {
  // https://www.amd.com/en/direct-buy/gb
  // https://www.amd.com/en/where-to-buy/radeon-rx-6000-series-graphics
  // let oosText = document.querySelectorAll('.btn-radeon')[0].innerText
  // AMD.COM - OUT OF STOCK
  // https://www.amd.com/en/where-to-buy/ryzen-5000-series-processors
  // let oosText = document.querySelectorAll('.btn-radeon')[0].innerText
  // AMD.COM - OUT OF STOCK
};
const saveResponseAMDProduct = (page, ctx) => {
  try {
    data = [];
    const $ = cheerio.load(page);

    let stockText = $(".btn-radeon")[0].innerText;
    console.log(stockText);
    if (stockText != "AMD.COM - OUT OF STOCK") {
      handleProductFound(ctx);
    }
  } catch (err) {
    console.log("AMD - Product | Error");
    console.log(err);
    sendTweet("AMD Product error!");
  }
};
const saveResponseCurrys = (page, ctx) => {
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
};
const handleProductFound = (ctx) => {
  let twitterMessage = `${ctx.name} \n ${ctx.url}`;
  let logMessage = `${getCurrentDate()} | ${ctx.name} | ${ctx.url} `;

  // only send tweet when app is live!
  if (appConfig.TEST_APP == "false")sendTweet(twitterMessage);
  
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
if (appConfig.ENABLE_APP == "true")
  setInterval(() => {
    checkTargets();
  }, 120000);
  //120000
// Nvidia
// $('.featured-buy-link')[0].text()
// .stock-grey-out
