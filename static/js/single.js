
function addToCart(id, name, qty, price, total,link) {
    console.log(price)
    var cartitem = document.querySelector(`[data-index*="${id}"]`);
    var caritems = document.querySelector('.cd-cart-items');
    var empty = document.getElementById('cart-empty');

    if (cartitem) {
        cartitem.querySelector('.cd-qty').innerHTML = qty + 'x'
        document.querySelector("#cart-total span") ? document.querySelector("#cart-total span").innerHTML = 'R$ ' + String(total) : ''
    } else {
        empty ? empty.remove() : ''
        caritems.innerHTML += `      <li data-index="${id}">
        <p class="cd-title"><a class="uk-link-reset" href="${link}">${name}</a></p>
        <span class="cd-qty">${qty}x</span>
        <div class="cd-price">R$ ${price}</div>
        <a href="" class="cd-item-remove cd-img-replace"><span uk-icon="icon: close"></span></a>
        </li>`
        document.getElementById('cart-total') ? document.getElementById('cart-total').style.display = 'block' : ''
        document.getElementById('cart-opt') ? document.getElementById('cart-opt').style.display = 'block' : ''

        document.querySelector("#cart-total span") ? document.querySelector("#cart-total span").innerHTML = 'R$ ' + String(total) : ''
    }

}




/**
 * INÍCIO DO CÁLCULO DE FRETE
 */
var csrf_token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
var postalCode = document.getElementById("id_cep");
var modalFrete = document.getElementById("modal-frete");
var mdb = document.getElementById('modal-body');
var fretes = document.getElementById("fretes");
let checkCep = '';
let regexCep = /([0-9]{5}-[\d]{3})|([0-9]{8})/

function getAddress() {

    let cep = postalCode.value.replace("-", "")

    if (!(regexCep.test(String(cep)))) { UIkit.notification(`<p class="uk-text-center uk-margin-remove">Favor inserir um CEP válido</p>`, { status: 'danger' }); return false }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {

            if (data.erro) { UIkit.notification(`<p class="uk-text-center uk-margin-remove">CEP não existente</p>`, { status: 'danger' }); } else {

                if (checkCep != cep) {
                    modalClear();
                    if (data.localidade == "João Pessoa" || data.localidade == "Cabedelo" || data.localidade == "Bayeux") {
                        getModal(true);
                        callLoad()

                    } else {
                        callFrete(cep);
                        callLoad()
                    }
                } else {

                    mdb.innerHTML.trim().length > 0 ? UIkit.modal(modalFrete).show() : UIkit.notification(`<p class="uk-text-center uk-margin-remove">Não há Fretes para serem exibidos</p>`, { status: 'danger' })

                }

            }

            checkCep = cep
        })
        .catch((error) => {
            console.log(error)
            UIkit.notification(`<p class="uk-text-center uk-margin-remove">Houve um erro ao processar o frete</p>`, { status: 'danger' });
            modalClear();
        })
}



function modalClear() {
    mdb.innerHTML = '';
    UIkit.modal(modalFrete).hide();
}

// function getModal(gratis, data) {

//     gratis ? (
//         divgratis = `<label>
//               <input type="radio" name="demo" class="card-input-element d-none" id="demo1">
//               <div class="uk-card card-body bg-light success d-flex flex-row justify-content-between align-items-center">
//               <div>
//                 <p class="uk-margin-remove">Frete Grátis</p>
//               </div>
//               <span class="uk-margin-small-right" id="check-fr" uk-icon="check"></span>
//               <span class="uk-margin-small-right" id="loc-fr" uk-icon="location"></span>
//               </div>
//             </label>`,
//         mdb.innerHTML += divgratis
//     ) : (

//         Object.keys(data).forEach(function (key) {
//             console.log('Key : ' + key + ', Value : ' + data[key])
//             let entrega = data[key].prazoEntrega > 1 ? 'dias úteis' : 'dia útil'
//             divfrete = `
//             <div class="uk-margin">
//             <label>
//                       <input type="radio" name="demo" class="card-input-element d-none" id="demo1">
//                       <div class="uk-card card-body bg-light d-flex flex-row justify-content-between align-items-center">
//                       <div>
//                         <p class="uk-margin-remove">${key}</p>
//                         <p class="uk-margin-remove" style="color:var(--success);">R$ ${data[key].valor}</p>
//                         <p class="uk-text-meta">Entrega em até ${data[key].prazoEntrega} ${entrega} a partir da data da postagem.</p>
//                       </div>
//                       <span class="uk-margin-small-right" id="check-fr" uk-icon="check"></span>
//                       <span class="uk-margin-small-right" id="loc-fr" uk-icon="location"></span>
//                       </div>
//                     </label>
//             </div>`
//             mdb.innerHTML += divfrete;
//         })

//     )

//     callLoad(fretes);
//     // mdb.innerHTML += gratis ? divgratis : divfrete
//     UIkit.modal(modalFrete).show();
// }


function getModal(gratis, data) {

    gratis ? (
        divgratis = `<label>
        <input type="radio" name="frete" class="card-input-element d-none" value="0,00">
              <div class="uk-card card card-body bg-light success d-flex flex-row justify-content-between align-items-center">
              <div>
                <p class="uk-margin-remove tipo">Frete Grátis</p>
              </div>
              <span class="uk-margin-small-right" id="check-fr" uk-icon="check"></span>
              <span class="uk-margin-small-right" id="loc-fr" uk-icon="location"></span>
              </div>
            </label>`,
        mdb.innerHTML += divgratis
    ) : (

        Object.keys(data).forEach(function (key) {
            console.log('Key : ' + key + ', Value : ' + data[key])
            let entrega = data[key].prazoEntrega > 1 ? 'dias úteis' : 'dia útil'
            divfrete = `
            <div class="uk-margin">
            <label>
                      <input type="radio" name="frete" class="card-input-element d-none" value="${data[key].valor}">
                      <div class="uk-card card card-body bg-light d-flex uk-flex-wrap flex-row justify-content-between align-items-center uk-margin-remove">
                      <div>
                        <p class="uk-margin-remove tipo">${key}</p>
                        <p class="uk-margin-remove frete-val" style="color:var(--success);">R$ ${data[key].valor}</p>
                        <p class="uk-text-meta">Entrega em até ${data[key].prazoEntrega} ${entrega} a partir da data da postagem.</p>
                      </div>
                      <span class="uk-margin-small-right" id="check-fr" uk-icon="check"></span>
                      <span class="uk-margin-small-right" id="loc-fr" uk-icon="location"></span>
                      </div>
                    </label>
            </div>`
            mdb.innerHTML += divfrete;
        })

    )

    callLoad()
    // mdb.innerHTML += gratis ? divgratis : divfrete
    UIkit.modal(modalFrete).show();
}



function callFrete(cep) {

    let dados = {
        "peso": 1,
        "comprimento": 18,
        "altura": 9,
        "largura": 27,
        "diametro": 0,
        "cepOrigem": "58042300",
        "cepDestino": String(cep)
    }

    let headers = {
        'Content-Type': 'application/json',
    }

    fetch('https://freteapi.vercel.app/frete/', {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        headers: headers,
        body: JSON.stringify(dados)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            getModal(false, data)
            // callLoad()
        })
        .catch((error) => {
            console.log(error);
            UIkit.notification(`<p class="uk-text-center uk-margin-remove">Houve um erro ao processar o frete</p>`, { status: 'danger' });
            callLoad()
            modalClear();
        })

}

// var postCode = document.getElementById('id_cep');

// postCode ? (
//     IMask(postCode, {
//         mask: '00000-000'
//     })
// ) : (null)


postalCode ? 
    ( postalCode.addEventListener("keyup", function (event) { if (event.keyCode === 13) { event.preventDefault(); document.getElementById("btnFrete").click()}}), 
    IMask(postalCode, { mask: '00000-000'}) ) : (null)

/**
 * FIM DO CÁLCULO DE FRETE
 */

/**
 * INÍCIO DE ADIÇÃO DE FRETE
 */

const btnSelFrete = document.querySelector(".sel-frete");
var btnRmvFrete = document.querySelector(".rmv-frete");

btnSelFrete.addEventListener("click",(e) => {

    e.preventDefault()
    btnSelFrete.remove()
    var valorFrete = document.querySelector('input[name="frete"]:checked')
    let cep = postalCode.value.replace("-", "")
    
    if (valorFrete) {

        callLoad();

        var tipo = valorFrete.nextElementSibling.querySelector(".tipo").innerText;
        let divCep = document.querySelector(".input-cep");
        let divFrete = document.querySelector(".div-frete");
        let valTotal = document.querySelector("#total");
        let dados = {
            "peso": 1,
            "comprimento": 18,
            "altura": 9,
            "largura": 27,
            "diametro": 0,
            "cepOrigem": "58042300",
            "cepDestino": cep,
            "valor": valorFrete.value,
            "tipo": tipo
        }
    
        let headers = {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        }
    
        fetch('/pedidos/frete/', {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            headers: headers,
            body: JSON.stringify(dados)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // getModal(false, data)
                if (divCep) {
                    divCep.remove()
                    divFrete.classList.add("row")
                    divFrete.innerHTML += `<div id="total-frete" class="col text-right"><a href="#" class="uk-icon-link uk-margin-small-right rmv-frete" uk-icon="trash"></a> R$ ${data.valor.replace(".",",")}</div>`
                    valTotal.innerText = `R$ ${data.total}`
                    modalClear();
                    btnRmvFrete = document.querySelector(".rmv-frete");
                    rmvFrete();
                    callLoad()
                }
            })
            .catch((error) => {
                console.log(error);
                UIkit.notification(`<p class="uk-text-center uk-margin-remove">Houve um erro ao processar o frete</p>`, { status: 'danger' });
                callLoad()
                modalClear();
            })

    } else {
        UIkit.notification(`<p class="uk-text-center uk-margin-remove">Selecione um Frete</p>`, { status: 'warning' })
    }

})

function rmvFrete() {

    btnRmvFrete ? (btnRmvFrete.addEventListener("click",(e) => {
    
        let divFrete = document.querySelector(".div-frete");
        let valTotal = document.querySelector("#total");
        let headers = {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        }
    
        fetch('/pedidos/deletefrete/', {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            headers: headers,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // divFrete.classList.remove("row")
                // divFrete.innerHTML = `<p>FRETE</p>
                // <div class="uk-flex uk-inline uk-margin-bottom input-cep">
                //   <input id="id_cep" inputmode="numeric" class="uk-input uk-width-1-2@l" placeholder="CEP" type="text">
                //   <button onclick="getAddress()" id="btnFrete"
                //     class="uk-button uk-button-secondary uk-width-1-4@l uk-margin-left">OK</button>
                // </div>`
                // valTotal.innerText = `R$ ${data.total}`

                window.location.reload()
                // modalClear();
                callLoad()
            })
            .catch((error) => {
                console.log(error);
                UIkit.notification(`<p class="uk-text-center uk-margin-remove">Houve um erro ao processar o frete</p>`, { status: 'danger' });
                callLoad()
                modalClear();
            })
    }) ) : (null)
}

rmvFrete();