const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");


const targets = [
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
];

// Loop through ALL the targets products!
for (let i = 0; i < targets.length; i++) {
  const ctx = targets[i];

  // query the web page.
  axios
    .get(ctx.url)
    .then((page) => {
      switch (ctx.retailer) {
        case "OcUk":
          saveResponseOc(page, ctx);
          break;
        case "ScanUk":
          break;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const saveResponseOc = (page, ctx) => {
  data = [];
  const $ = cheerio.load(page);

  let initialResult = $("#comingsoonDetails")[0];
  // possibly, in stock...
  if (typeof initialResult === "undefined") {
    let secondResult = $(".sAddToBasketButton")[0];
    // in stock!
    if (typeof secondResult !== "undefined") {
      saveToFile("Found card! " + ctx.name + " " + ctx.url);
    }
  }
  saveToFile(".");
  // console.log(initialResult)
};

const saveResponseScan = (page, ctx) => {};

const saveToFile = (data) => {
  fs.appendFile("log.txt", "\n " + data, function (err) {
    console.log(err);
  });
};

// in stock : $('.sAddToBasketButton')[0]
// out of stock : $('#comingsoonDetails')[0]
