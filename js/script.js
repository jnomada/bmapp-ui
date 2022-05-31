//////////////////////////////////////////////////////////////////////////////////////
// ELEMENTOS DOM

const mainApp = document.getElementById("main");
const expenseTable = document.getElementById("tablaDatos");
const tablaDatosBody = document.getElementById("tablaDatosBody");

// NAVBAR
const asideMobile = document.getElementById("aside-movil");
const menuicon = document.getElementById("menuicon");


//const addExpenseDialog = document.getElementById("addExpenseDiv");
const addExpenseDialog = document.getElementById("addExpenseForm");
const searchIconBig = document.getElementById("searchIconBig");
const spinner = document.getElementById("spinner");

// DIALOGO INFORMACION
const messageDialogText = document.getElementById('messageDialogText');
const messageDialog = document.getElementById('messageDialog');
const messageDialogBox = document.getElementById('messageDialogBox');


// LOGIN VARIABLES

const loginUsernameInput = document.getElementById("loginUsernameInput");
const loginPasswordInput = document.getElementById("loginPasswordInput");
const loginBtn = document.getElementById("loginBtn");
const loginForm = document.getElementById('login');

const prevLogin = document.querySelector('#loginRegister');
const featuresSection = document.getElementById('Features');
const welcomeMessage = document.querySelector('#welcomeMessage');


// REGISTER VARIABLES
const registerUsernameInput = document.getElementById('registerUsernameInput');
const registerEmailInput = document.getElementById('registerEmailInput');
const registerPasswordInput = document.getElementById('registerPasswordInput');
const registerRetypePasswordInput = document.getElementById('registerRetypePasswordInput');
const registerForm = document.getElementById('register');

// DIALOGO AÑADIR GASTO
const addExpenseCloseButton = document.getElementById('addExpenseCloseButton');
const addExpenseForm = document.getElementById('addExpenseForm');
const addExpenseOverlay = document.getElementById('addExpenseOverlay');

// MODAL ELIMINAR GASTOS
const expenseModal = document.getElementById('deleteExpensesOverlay')
const deleteYes = document.getElementById('deleteYes');
const deleteCancel = document.getElementById('deleteCancel');

// NAVEGACION FECHA ACTUAL
const leftArrowCurrentDate = document.getElementById('arrows-left');
const rightArrowCurrentDate = document.getElementById('arrows-right');

// NAVEGACION PANEL LATERAL
const dashboardMain = document.getElementById('dashboard-main');
const gastosMain = document.getElementById('gastos-main');
const graficosMain = document.getElementById('graficos-main');
const acercaDe = document.getElementById('acerca-de');

// PANTALLA INICIO
const chartHolder = document.getElementById('chartGastosMes');

// DATOS DEL SERVIDOR
const serverAddress = 'http://192.168.8.118:8080';

//////////////////////////////////////////////////////////////////////////////////////
// ESTADO DE LA APLICACIÓN
let appState = {
    user: {
        userId: "",
        username: '',
        password: ''
    },
    loggedIn: false,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    thisYear: new Date().getFullYear(),
    thisMonth: new Date().getMonth() + 1
}

const resetState = function() {
    appState = {
        user: {
            userId: "",
            username: '',
            password: ''
        },
        loggedIn: false,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        thisYear: new Date().getFullYear(),
        thisMonth: new Date().getMonth() + 1
    }
}


let chartData = [];

//////////////////////////////////////////////////////////////////////////////////////
// LOGIN FALSO PARA PRUEBAS

/*function fakeLogin() {
    prevLogin.style.display = "none";
    mainApp.style.display = "grid";
    appState.loggedIn = true;
    loginUsernameInput.classList.add('hide');
    loginPasswordInput.classList.add('hide');
    loginBtn.textContent = "LOGOUT"
    loginBtn.classList.add('hide');
    logoutBtn.classList.remove('hide');
    welcomeMessage.textContent = `Bienvenido ${appState.user.username}`;
    welcomeMessage.parentElement.classList.remove('hide');
}*/

//fakeLogin();

/* HASTA AQUI */ /////


//////////////////////////////////////////////////////////////////////////////////////
// EVENT LISTENERS

let checkedArray = [];

const getCheckedBoxes = function () {
    
    const checkboxes = document.querySelectorAll(".selectedBox");


    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                checkedArray.push(checkbox.value);
            } else {
                checkedArray.splice(checkedArray.indexOf(checkbox.value), 1);
            }

        })

    });

}

addExpenseCloseButton.addEventListener('click', function () {
    hideAddExpenseDialog();

})

messageDialogCloseBtn.addEventListener('click', function () {
    closeInfoDialog();
});



const showAddExpenseDialog = function () {
    addExpenseForm.style.display = 'block';
    addExpenseOverlay.style.display = 'block';


}

const hideAddExpenseDialog = function () {

    addExpenseForm.style.display = 'none';
    addExpenseOverlay.style.display = 'none';
}




//OBTENER MES
const setDate = function () {
    appState.month = document.getElementById('monthSelect').value;
    appState.year = document.getElementById('yearSelect').value;

    cargarDatos();
}

// CARGAR DATOS
const cargarDatos = function() {

    tablaDatosBody.innerHTML = "";

    document.getElementById('currentMonth').textContent = document.getElementById('monthSelect').options[appState.month - 1].text;
    document.getElementById('currentYear').textContent = " " + appState.year;

    var xhttp = new XMLHttpRequest();

    var data = `{
        "username": "${appState.user.username}",
        "password": "${appState.user.password}",
        "expenseYear": "${appState.year}",
        "expenseMonth": "${appState.month}"
        
    }`

    console.log(data);

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            var expenseData = JSON.parse(this.responseText);

            if(expenseData != null) {
                let totalMonth = 0;

                var html = '';
    
                for (i = 0; i < expenseData.length; i++) {
    
                    html += `<tr><td><input type="checkbox" class="selectedBox" value="${expenseData[i].expenseId}"></input></td><td>${expenseData[i].expenseDate}</td>
                <td>${expenseData[i].type}</td><td>${expenseData[i].description}</td>
                <td>${expenseData[i].amount.toFixed(2)} €</td></tr>`;
    
                    totalMonth += expenseData[i].amount;
                }
    
                tablaDatosBody.innerHTML = "";
                tablaDatosBody.insertAdjacentHTML("afterbegin", html);
                tablaDatosBody.classList.add('scrollable');
    
                displayTotal(totalMonth);
                loadGoogleCharts();
                getCheckedBoxes();
            }          

        } else {
            spinner.classList.remove("hide");
        }

    }

    xhttp.open("POST", `${serverAddress}/expenses/getexpense`, true);

    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.send(data);



}

//////////////////////////////////////////////////////////////////////////////////////
// NAVIGACION FLECHAS FECHA
const leftArrow = function () {
    console.log('left arrow clicked');

    if (appState.month > 1) {
        appState.month--;
    } else if (appState.month = 1) {
        appState.month = 12;
        appState.year--;
    }

    console.log(appState.month, appState.year);
    cargarDatos();

}

const rightArrow = function () {
    console.log('right arrow clicked');

    if (appState.month < 12) {
        appState.month++;
    } else if (appState.month = 12) {
        appState.month = 1;
        appState.year++;
    }

    console.log(appState.month, appState.year);
    cargarDatos();

}

//////////////////////////////////////////////////////////////////////////////////////
// AÑADIR GASTO
const submitExpense = function() {

    var url = `${serverAddress}/expenses`;

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url);

    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {

        if (xhttp.readyState === 4 && this.status == 200) {
            console.log(xhttp.status);
            console.log(xhttp.responseText);
            cargarDatos();
            showInfoDialog(xhttp.responseText, 'info');

        } else if (this.status == 400 || this.status == 500) {
            showInfoDialog(xhttp.responseText, 'warning');

        }
    }

    var data = `{
    "userId":"${appState.user.userId}",
    "type":"${document.getElementById('typeInput').value}",
    "description":"${document.getElementById('descriptionInput').value}",
    "amount":"${document.getElementById('amountInput').value}",
    "expenseDate":"${document.getElementById('expenseDate').value}"
    }`;

    console.log(data);

    xhttp.send(data);



    document.getElementById('amountInput').value = "";
    document.getElementById('descriptionInput').value = "";

    const popupMessageContent = document.getElementById("popupMessageContent");

    hideAddExpenseDialog();

    

}

//////////////////////////////////////////////////////////////////////////////////////
// MOSTRAR TOTALES
const displayTotal = function(total) {

    document.getElementById("totalMonth").textContent = `${total.toFixed(2)} €`;
    //document.getElementById("chartGastosMesText").textContent = `${total.toFixed(2)} €`;

}

//////////////////////////////////////////////////////////////////////////////////////
// BORRAR GASTOS


const deleteExpenses = function() {

    expenseModal.style.display = 'flex';  
    
}

deleteYes.addEventListener('click', function() {
    getCheckedBoxes();
    
    if(checkedArray.length > 0) {
        const url = `${serverAddress}/expenses`;
        const xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", url);
    
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");
    
    
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                console.log(xhttp.status);
                console.log(xhttp.responseText);
                checkedArray = [];
                cargarDatos();
            }
        }
    
        var data = `{
            "userId":"${appState.user.userId}",
            "deleteExpenses": [${checkedArray}]
        }`;
    
        console.log(data);
    
        xhttp.send(data);
    
        

        expenseModal.style.display = 'none';
        showInfoDialog(`${checkedArray.length} gastos fueron eliminados`, 'info');
    
    } else {
        expenseModal.style.display = 'none';
        showInfoDialog('No has marcado ningún gasto', 'warning');
    }
   

});

deleteCancel.addEventListener('click', function() {
    expenseModal.style.display = 'none';
});

//////////////////////////////////////////////////////////////////////////////////////
// REGISTRO VALIDACIÓN
const registerValidation = function (username, email, password, password2) {

    console.log(username, email, password, password2);
    let validated = false;

    if (username.length >= 5 && email.length >= 8 && password.length >= 8 && password == password2) {
        validated = true;
    } else {
        validated = false;
    }

    return validated;
}

// REGISTRO
const register = function () {


    const url = `${serverAddress}/users`;

    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);

    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            console.log(xhttp.status);
            console.log(xhttp.responseText);
            showInfoDialog(xhttp.responseText, 'info');
            showLogForm();

        } else if (xhttp.status === 400) {
            showInfoDialog(xhttp.responseText, 'warning');
            return null;
        }
    }

    const validated = registerValidation(
        registerUsernameInput.value,
        registerEmailInput.value,
        registerPasswordInput.value,
        registerRetypePasswordInput.value
    );

    let data = null;

    if (validated) {

        data = `{
            "username":"${registerUsernameInput.value}",
            "email":"${registerEmailInput.value}",
            "password":"${registerPasswordInput.value}"
        }`;



        console.log('Data valid');
        xhttp.send(data);
    } else {
        console.log('Data NOT valid');
        showInfoDialog('Datos incorrectos. Comprueba que las contraseñas coincidan y que tengan como mínimo 8 caractéres', 'warning')
    }


}

////////////////////////////////////////////////////////////////////////////////////////
// LOGIN

// LOGIN - VALIDACION

/*const loginValidation = function (username, password) {

    
    let validated = false;

    if (username.length >= 5 && password.length >= 8) {
        validated = true;
    } else {
        validated = false;
    }

    return validated;
}*/

const login = function () {
    
    //let validated = loginValidation(loginUsernameInput.value, loginPasswordInput.value);    
    
    resetState();
    

        appState.user.username = loginUsernameInput.value;
        appState.user.password = loginPasswordInput.value;

        const url = `${serverAddress}/users/userlogin`;

        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);

        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                console.log(xhttp.status);

                if (JSON.parse(xhttp.responseText).userId != null) {
                    appState.user.userId = JSON.parse(xhttp.responseText).userId;
                    appState.loggedIn = true;

                    cargarDatos();

                    updateUI();
                }

            } else if (xhttp.status == 400) {
                showInfoDialog(xhttp.responseText, 'warning');
                return null;
            }
        }

        let data = null;

        data = `{
                    "username":"${loginUsernameInput.value}",
                    "password":"${loginPasswordInput.value}"
                }`;

        xhttp.send(data);


        const showAddExpenseDialog = function () {
    
            addExpenseDialog.classList.remove("hideDialog");
    
        }
    
        const hideAddExpenseDialog = function () {
    
            addExpenseDialog.classList.add("hideDialog");
    
        }
    
        hideAddExpenseDialog();
        closeInfoDialog();
        updateUI();


   


    

}

registerForm.classList.add('hide');


//////////////////////////////////////////////////////////////////////////////////////
// ANIMACIONES FORMULARIOS REGISTRO Y LOGIN
const showRegForm = function () {

    loginForm.classList.add('hide');
    registerForm.classList.remove('hide');

}


const showLogForm = function () {

    registerForm.classList.add('hide');
    loginForm.classList.remove('hide');
}

//////////////////////////////////////////////////////////////////////////////////////
// LOGOUT
const logout = function () {

    resetState();

    appState.loggedIn = false;

    updateUI();

}


//////////////////////////////////////////////////////////////////////////////////////
// ACTUALIZAR INTERFAZ DE USUARIO
const updateUI = function () {

    loginUsernameInput.value = '';
    loginPasswordInput.value = '';

    if (appState.loggedIn) {

        prevLogin.style.display = "none";
        mainApp.style.display = "grid";
        appState.loggedIn = true;
        loginUsernameInput.classList.add('hide');
        loginPasswordInput.classList.add('hide');
        loginBtn.textContent = "LOGOUT"
        loginBtn.classList.add('hide');
        logoutBtn.classList.remove('hide');
        welcomeMessage.textContent = `Bienvenido ${appState.user.username}`;
        welcomeMessage.parentElement.classList.remove('hide');
        mostrarInicio();


    } else {

        prevLogin.style.display = "flex";
        mainApp.style.display = "none";
        loginBtn.textContent = "LOGIN"
        loginBtn.classList.remove('hide');
        loginUsernameInput.classList.remove('hide');
        loginPasswordInput.classList.remove('hide');
        logoutBtn.classList.add('hide');
        welcomeMessage.parentElement.classList.add('hide');




    }

}

//////////////////////////////////////////////////////////////////////////////////////
// NAVEGACION LATERAL (ASIDE)
const mostrarInicio = function () {
    dashboardMain.classList.remove('hide');
    gastosMain.classList.add('hide');
    graficosMain.classList.add('hide');
    acercaDe.classList.add('hide');
    
    if (!dashboardMain.classList.contains('hide')) hideMobileAside();

}

const mostrarGastos = function () {
    gastosMain.classList.remove('hide');
    graficosMain.classList.add('hide');
    dashboardMain.classList.add('hide');
    acercaDe.classList.add('hide');
    hideMobileAside();
}

const mostrarGraficos = function () {
    graficosMain.classList.remove('hide');
    gastosMain.classList.add('hide');
    dashboardMain.classList.add('hide');
    acercaDe.classList.add('hide');
    hideMobileAside();
}

const mostrarAcercaDe = function () {
    graficosMain.classList.add('hide');
    gastosMain.classList.add('hide');
    dashboardMain.classList.add('hide');
    acercaDe.classList.remove('hide');
    hideMobileAside();

}

//////////////////////////////////////////////////////////////////////////////////////
// Scripts de gráficos

// Load the Visualization API and the corechart package.
google.charts.load('current', {
    'packages': ['corechart']
});

const loadGoogleCharts = function () {
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawAllCharts);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
}


//////////////////////////////////////////////////////////////////////////////////////
// CARGAR DATOS PARA GRÁFICOS Y DIBUJARLOS
function drawAllCharts() {
    getYearExpenses();
    getMonthData();
    getTypeMonthData();
    getTypeYearData()
    getDailyExpensesMonth();
    drawTipoGastosMes();
    drawGastosDiasMes();
    drawTipoGastosAno();
    //drawEvolGastosAno();

}

//////////////////////////////////////////////////////////////////////////////////////
// MAPA DE MESES PARA UTILIZAR SU CLAVE/VALOR 
const meses = [
    ['1', 'Enero'],
    ['2', 'Febrero'],
    ['3', 'Marzo'],
    ['4', 'Abril'],
    ['5', 'Mayo'],
    ['6', 'Junio'],
    ['7', 'Julio'],
    ['8', 'Agosto'],
    ['9', 'Septiembre'],
    ['10', 'Octubre'],
    ['11', 'Noviembre'],
    ['12', 'Diciembre']
];

let mesesMap = new Map(meses);

//////////////////////////////////////////////////////////////////////////////////////
// FUNCIONES PARA LOS GRÁFICOS
function drawGastosDiasMes(myData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Día');
    data.addColumn('number', 'Cantidad');
    data.addRows(myData);

    // Set chart options
    var options = {
        'title': 'Gastos por días',
        'width': 600,
        'height': 400

    }

    // Instantiate and draw our chart, passing in some options
    var chart = new google.visualization.BarChart(document.getElementById('gastosDiasMes'));

    chart.draw(data, options);
}


// DIBUJAR GRAFICO TIPO DE GASTOS DEL AÑO
function drawTipoGastosAno(myData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Tipo');
    data.addColumn('number', 'Cantidad');
    data.addRows(myData);

    // Set chart options
    var options = {
        'title': 'Tipo de gastos este año',
        'width': 600,
        'height': 400,
        pieHole: 0.4,

    }

    // Instantiate and draw our chart, passing in some options
    var chart = new google.visualization.PieChart(document.getElementById('tipoGastosAno'));

    chart.draw(data, options);
}

// DIBUJAR GRAFICO GASTOS DE LOS MESES DEL AÑO
function drawGastosMesesAno(mData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Tipo');
    data.addColumn('number', 'Cantidad');
    data.addRows(mData);

    // Set chart options
    var options = {
        'title': 'Evolución de gastos este año',
        'width': 600,
        'height': 400
    }

    // Instantiate and draw our chart, passing in some options
    var chart = new google.visualization.ColumnChart(document.getElementById('evolGastosAno'));

    chart.draw(data, options);
}


// OBTENER DATOS PARA GRAFICOS 

const getYearExpenses = function () {

    let dataYear = [];


    var xhttp = new XMLHttpRequest();

    var data = `{
        "username": "${appState.user.username}",
        "password": "${appState.user.password}",
        "expenseYear": "${appState.thisYear}"        
    }`

    console.log(data);

    xhttp.onreadystatechange = function () {

        let totalYear = 0;

        if (this.readyState == 4 && this.status == 200) {

            chartData = JSON.parse(this.responseText);

            for (i = 0; i < chartData.length; i++) {

                chartData[i][0] = mesesMap.get(chartData[i][0].toString());
                chartData[i][1] = Number(chartData[i][1].toFixed(2));

                totalYear += chartData[i][1];
            }

            chartData;

            updatechartGastosAno(totalYear);
            drawGastosMesesAno(chartData);


        } else {
            console.log('Could not get data');
        }



    }

    xhttp.open("POST", `${serverAddress}/expenses/chartdata`, true);

    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.send(data);



}

const updatechartGastosAno = function (totalYear) {

    document.getElementById('chartGastosAnoText').textContent = totalYear.toFixed(2).toString() + ' €';

}



function getMonthData() {


    var xhttp = new XMLHttpRequest();

    var data = `{
        "username": "${appState.user.username}",
        "password": "${appState.user.password}",
        "expenseYear": "${appState.thisYear}",
        "expenseMonth": "${appState.thisMonth}"
        
    }`

    console.log(data);

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            var expenseData = JSON.parse(this.responseText);

            console.log(expenseData);

            let totalMonth = 0;


            for (i = 0; i < expenseData.length; i++) {


                totalMonth += expenseData[i].amount;
            }

            document.getElementById("chartGastosMesText").textContent = `${totalMonth.toFixed(2)} €`;


        } else {
            //spinner.classList.remove("hide");
        }

    }

    xhttp.open("POST", `${serverAddress}/expenses/getexpense`, true);

    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.send(data);

}



function drawTipoGastosMes(myData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Tipo');
    data.addColumn('number', 'Cantidad');
    data.addRows(myData);

    console.log('myData', myData);

    // Set chart options
    var options = {
        'title': 'Tipo de gastos este mes',
        'width': 600,
        'height': 400,
        pieHole: 0.4,
    }

    // Instantiate and draw our chart, passing in some options
    var chart = new google.visualization.PieChart(document.getElementById('tipoGastosMes'));
    var chart2 = new google.visualization.PieChart(document.getElementById('tipoGastosMes2'));
    chart.draw(data, options);
    chart2.draw(data, options);
}

function getTypeMonthData() {


    var xhttp = new XMLHttpRequest();

    var data = `{
        "username": "${appState.user.username}",
        "password": "${appState.user.password}",
        "expenseYear": "${appState.thisYear}",
        "expenseMonth": "${appState.thisMonth}"
        
    }`


    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            var chartData = JSON.parse(this.responseText);


            chartData = JSON.parse(this.responseText);

            for (i = 0; i < chartData.length; i++) {

                chartData[i][1] = Number(chartData[i][1].toFixed(2));


            }


            drawTipoGastosMes(chartData);



        } else {
            //spinner.classList.remove("hide");
        }

    }

    xhttp.open("POST", `${serverAddress}/expenses/typeMonthData`, true);

    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.send(data);

}


// GASTOS TOTALES POR TIPO DEL AÑO ACTUAL
function getTypeYearData() {


    var xhttp = new XMLHttpRequest();

    var data = `{
        "username": "${appState.user.username}",
        "password": "${appState.user.password}",
        "expenseYear": "${appState.thisYear}",
        "expenseMonth": "${appState.thisMonth}"
        
    }`


    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            var chartData = JSON.parse(this.responseText);


            chartData = JSON.parse(this.responseText);

            for (i = 0; i < chartData.length; i++) {


                chartData[i][1] = Number(chartData[i][1].toFixed(2));


            }


            drawTipoGastosAno(chartData);



        } else {
            //spinner.classList.remove("hide");
        }

    }

    xhttp.open("POST", `${serverAddress}/expenses/typeYearData`, true);

    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.send(data);

}

// Obtener los gastos de cada dia del mes
function getDailyExpensesMonth() {


    var xhttp = new XMLHttpRequest();

    var data = `{
        "username": "${appState.user.username}",
        "password": "${appState.user.password}",
        "expenseYear": "${appState.thisYear}",
        "expenseMonth": "${appState.thisMonth}"
        
    }`


    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            var chartData = JSON.parse(this.responseText);


            chartData = JSON.parse(this.responseText);

            for (i = 0; i < chartData.length; i++) {


                chartData[i][1] = Number(chartData[i][1].toFixed(2));


            }



            drawGastosDiasMes(chartData);



        } else {
            //spinner.classList.remove("hide");
        }

    }

    xhttp.open("POST", `${serverAddress}/expenses/daysOfMonthData`, true);

    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.send(data);

}


//////////////////////////////////////////////////////////////////////////////////////
// ANIMACIONES

// PANTALLA INICIO

document.querySelector('.roundDisplay').addEventListener('click', function () {
    console.log('clicked!');
})


//////////////////////////////////////////////////////////////////////////////////////
// DIALOGO INFORMACION
const showInfoDialog = function (message, type) {
    messageDialogText.textContent = message;

    switch(type) {
        case 'warning': messageDialog.style.backgroundColor = '#d95a3b';
        break;
        case 'info': messageDialog.style.backgroundColor = '#3fd4d9';
        break;
        default: messageDialog.style.backgroundColor = '#3fd4d9';
        break;
    }

    messageDialogBox.style.height = '60px';
    
    
}

const closeInfoDialog = function () {

    messageDialogBox.style.height = "0px";
    
}

//////////////////////////////////////////////////////////////////////////////////////
// MENU LATERAL MOVIL
let menuOpen = null;

const mobileAsideAction = function() {

    if(menuOpen) {
        console.log('closing');
        asideMobile.style.display = 'none';
        menuicon.src = "./img/menumobile.svg";
        menuOpen = false;
    } else {
        console.log('opening');
        asideMobile.style.display = 'block';
        menuicon.src = "./img/menumobileclose.png";
        menuOpen = true;
    }

    
}

const hideMobileAside = function() {
    asideMobile.style.display = 'none';
    menuicon.src = "./img/menumobile.svg";
    menuOpen = false;
    

}