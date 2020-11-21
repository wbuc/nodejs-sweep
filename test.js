var request = require("request");
var cheerio = require("cheerio");

console.log("in test!!!");

request(
  {
    uri:
      "https://www.scan.co.uk/products/sapphire-radeon-rx-6800-xt-16gb-gddr6-ray-tracing-graphics-card-7nm-rdna2-4608-streams-2015mhz",
  },
  function (error, response, body) {
    //var $ = cheerio.load(body);

    const $ = cheerio.load(body);

    let initialResult = $(".rightColumn .buyButtonNoPrice")[0];
    // possibly, in stock...
    if (typeof initialResult === "undefined") {
      let secondResult = $(".rightColumn .buyButton")[0];
      // in stock!
      if (typeof secondResult !== "undefined") {
        saveToFile("Found card! : Scan : " + ctx.name + " " + ctx.url);
      }
    }
    console.log(initialResult);
  }
);

request(
  {
    uri: "",
  },
  function (error, response, body) {}
);


/*
setTimeout(() => {
    console.log(getCurrentTime());
  }, 2000);
  

// RX 6800 XT - SAPPHIRE -  https://www.amazon.co.uk/dp/B08MVC76SR/?coliid=I2R0DXBP2BO9RL&colid=6181I142UJJ4&psc=0&ref_=lv_ov_lig_dp_it

//  https://www.amd.com/en/direct-buy/gb
// .btn-radeon : SOLD OUT


// Handle edge cases for AMD website.
      if (ctx.retailer == "AMD" || ctx.retailer == "AMDproduct") {
          console.log(ctx.name)
        axios
          .get(ctx.url)
          .then((page) => {
            switch (ctx.retailer) {
                case "AMDproduct":
                  saveResponseAMDProduct(page.data, ctx);
                  break;
                case "AMD":
                  saveResponseAMD(page.data, ctx);
                  break;          
                default:
                  break;
              }
          })
          .catch((err) => {
            console.log(err);
          });
       
        }




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

];