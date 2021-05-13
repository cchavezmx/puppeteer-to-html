const express = require("express")
const puppeteer = require("puppeteer")

// const { readFileSync } = require('fs')
// const path = require('path')

const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json({extended: true}))


app.get('/pdf', async(req, res) => {

  // const content = readFileSync(
  //   path.resolve('assets', './invoice.html'), 'utf-8'
  // )
  const carrito  = [ { title: "test", precio: 80, cantidad: 2 }, { title: "test2", precio: 80, cantidad: 2 }, { title: "test3", precio: 80, cantidad: 2 }]
  const llueve = carrito.map(item => {
    return( 
      `
        <tr>
        <td>${item.cantidad}</td>
        <td>${item.title}</td>
        <td>${ item.precio === 0 ? `<p>*Por cotizar</p>` : item.precio }</td>
        </tr>  

      `)
  })


  const web = `
  <!doctype html>
  <html lang="en">
    <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
  
      <!-- Bootstrap CSS -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-wEmeIV1mKuiNpC+IOBjI7aAzPcEZeedi5yW5f2yOq55WWLwNGmvvx4Um1vskeMj0" crossorigin="anonymous">
  
      <style>
        .back{
          width: 100%;
        }
  
        .invoice-wrapper{
          margin: 20px auto;
          width: 100%;
          
        }
        .invoice-top{
          background-color: #fafafa;
          padding: 40px 60px;
        }
        /*
        Invoice-top-left refers to the client name & address, service provided
        */
        .invoice-top-left{
          margin-top: 60px;
        }
        .invoice-top-left h2 , .invoice-top-left h6{
          line-height: 1.5;
          font-family: 'Montserrat', sans-serif;
        }
        .invoice-top-left h4{
          margin-top: 30px;
          font-family: 'Montserrat', sans-serif;
        }
        .invoice-top-left h5{
          line-height: 1.4;
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
        }
        .client-company-name{
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 0;
        }
        .client-address{
          font-size: 14px;
          margin-top: 5px;
          color: rgba(0,0,0,0.75);
        }
  
        /*
        Invoice-top-right refers to the our name & address, logo and date
        */
        .invoice-top-right h2 , .invoice-top-right h6{
          text-align: right;
          line-height: 1.5;
          font-family: 'Montserrat', sans-serif;
        }
        .invoice-top-right h5{
          line-height: 1.4;
            font-family: 'Montserrat', sans-serif;
            font-weight: 400;
            text-align: right;
            margin-top: 0;
        }
        .our-company-name{
          font-size: 16px;
            font-weight: 600;
            margin-bottom: 0;
        }
        .our-address{
          font-size: 13px;
          margin-top: 0;
          color: rgba(0,0,0,0.75);
        }
  
        .logo-wrapper{ 
          overflow: auto;
          display: flex;
          justify-content: flex-end;
          
        }
  
        /*
        Invoice-bottom refers to the bottom part of invoice template
        */
        .invoice-bottom{
          background-color: #ffffff;
          padding: 40px 60px;
          position: relative;
        }
        .invoice-title{
          font-size: x-large;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          
        }
        /*
        Invoice-bottom-left
        */
        .invoice-bottom-left h5, .invoice-bottom-left h4{
          font-family: 'Montserrat', sans-serif;
        }
        .invoice-bottom-left h4{
          font-weight: 400;
          font-size: large;
        }
        .terms{
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          margin-top: 40px;
        }
        .divider{
          margin-top: 50px;
            margin-bottom: 5px;
        }
        /*
        bottom-bar is colored bar located at bottom of invoice-card
        */
        .invoice-bottom-bar{
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 26px;
          background-color: #3B5998;
        }
  
        .invoice-datos-cliente{
          font-size: medium;
        }
  
        .invoice-button-send {
          
            border: none;
            border-radius: 4px;
            font-weight: bold;
            width: 12rem;
            padding: 0.86rem;
            color: #ffffff;
            border: 1px solid slategrey;
            background-color: rgb(223, 80, 80);  
        }
  
        .invoice-button-send:hover{
          color: rgb(223, 80, 80);
          border: 1px solid rgb(223, 80, 80);;
          background-color: white;  
        }
  
        .invoice-date{
          text-align: right;
          text-transform: uppercase;
          font-size: small;
          font-weight: bold;
        }
  
      </style>
  
  
  
    </head>
    <body>
      
      <section class="back">
        <div>
          <div>
            <div >
              <div class="invoice-wrapper">
                <div class="invoice-top">
                  <div class="row">
                    <div class="col-6">
                      <div class="invoice-top-left">
                        <h2 class="client-company-name">Instalaciónes Tecnólogicas Aplicadas</h2>
                        <h6 class="client-address">La Montaña, 28 A, CP: 53340 <br/>México</h6>
                        <h4 class="font-weight-bold">Datos del Cliente</h4>
                        <h5>Nombre del cliente</h5> 
                        <span class="invoice-datos-cliente">Email del Cliente<br/>direccion del cliente<br />telefono del cliente</span>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="invoice-top-right">
                        <h2 class="our-company-name">Grupo Intecsa</h2>
                        <h6 class="our-address">grupointeca.com, <br/>contacto@grupointecsa.com<br/>CDMX - México</h6>
                        <div class="logo-wrapper">
                          <img src="https://grupointecsa.com/web-logo.webp" class="img-responsive pull-right logo" alt="Logo del invoice"/>
                        </div>
                          <div>
                            <p class="mt-3 w-100 invoice-date">${Date.now()}</p>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="invoice-bottom">
                  <div class="row">
                    <div class="col-12">
                      <h5 class="invoice-title">Orde de Compra</h5>
                    </div>
                    <div class="clearfix"></div>
      
                    <div class="col-3 col-3">
                      <div class="invoice-bottom-left">
                        <h5>ITAMX No.</h5>
                        <h4 id="codigoOc">${"Codigo OC"}</h4>
                      </div>
                    </div>
                    <div class="col-offset-1 col-12 col-9 w-100">
                      <div class="invoice-bottom-right">
                        <table class="table">
                          <thead>
                            <tr>
                              <th>Cantidad</th>
                              <th>Descripción</th>
                              <th>Precio</th>
                            </tr>
                          </thead>
                          <tbody>
                                <!--  cosas del cliente -->
                                ${llueve}

                            <tr></tr>
                          </tbody>
                          <thead>
                            <tr>
                              <th>Total</th>
                              <th></th>
                              <th>Costo total</th>
                            </tr>
                          </thead>
                        </table>
                        <h4 class="terms">Terminos</h4>
                        <ul>
                          <li>El total de está orden de compra no representa el costo total de los materiales </li>
                        </ul>
                      </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="col-12">
                      <hr class="divider"/>
                    </div>
                    <div class="col-4">
                      <h6 class="text-left">itamx.com</h6>
                    </div>
                    <div class="col-4">
                      <h6 class="text-center">contacto@grupointecsa.com</h6>
                    </div>
                    <div class="col-4">
                      <h6 class="text-right">+52 55701197</h6>
                    </div>
                  </div>
                  <div class="invoice-bottom-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
          </div>
          </div>
  
        <script src="./script.js"></script>
  
      <!-- Optional JavaScript; choose one of the two! -->
  
      <!-- Option 1: Bootstrap Bundle with Popper -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8" crossorigin="anonymous"></script>
  
      <!-- Option 2: Separate Popper and Bootstrap JS -->
      
      <!--
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.min.js" integrity="sha384-lpyLfhYuitXl2zRZ5Bn2fqnhNAKOAaM/0Kr9laMspuaMiZfGmfwRNFh8HlMy49eQ" crossorigin="anonymous"></script>
      -->
    </body>
  </html>
  `

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.setContent(web)

  const buffer = await page.pdf({
    format: "letter",
    printBackground: true,
    scale: 0.9,
    margin: {
      left: "0px",
      top: "0px",
      right: "0px",
      bottom: "0px"
    }
  })

  await browser.close()

  res.contentType("application/pdf");

  console.log(buffer)

  res.send(buffer);


})


app.listen(PORT, () => {
  console.log(`Esta vivo!! en el puerto ${PORT}`)
})






