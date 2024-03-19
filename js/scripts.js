const apiUrl = 'https://viacep.com.br/ws/';
const apiGeoUrl  = `http://api.openweathermap.org/geo/1.0/direct?q=`; //geocodificação direta
const chaveApi = 'd20d97eec4dd1610d938b469bf8381fd'; //chave api



async function receberEPopularDados(cep){ 
    //dentro de uma função assincrona a primeira coisa é fzr um try/catch
    if(!cep){
        alert("informe o cep.")//verifica se o cep foi informado
        return;
    }
try{
    const url = `${apiUrl}${cep}/json`; //a const url recebe a APIURL/CEP como string e retorna no formato JSON
    const responseCep = await fetch(url);//fzr a requisição

    if(!responseCep.ok){ //verifica se a requisição foi bem sucedida
        if (responseCep.status === 400) { //erro de status http 400(erro na requisicao)
            alert("CEP invalido") //verifica se o cep é invalido
        }
       else{
        throw new Error('erro ao buscar o cep.')
       } 
       return; //retorna pra n popular tabela com dados errados
    }
    const dataCep = await responseCep.json()//extrair dados no formato json

    if (!dataCep.cep) { //verifica se o cep existe dentro da api
        alert('Cep não encontrado. Informe um cep válido.'); 
        return;
        
    }

    const cidade = document.querySelector('#cidade-input').value; 
        //requisicão da api
    const urlGeocoding = `${apiGeoUrl}${cidade}&appid=${chaveApi}`;
    const responseGeo = await fetch(urlGeocoding);

    if(!responseGeo.ok){ //validando
        throw new Error("Erro ao buscar cidade.")
    }
    const dataGeo = await responseGeo.json();

    if (!dataGeo.length) {
        alert("Cidade não encontrada")
        return;
    }

    const lat = dataGeo[0].lat;
    const lon = dataGeo[0].lon;

    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${chaveApi}&lang=pt_br`;
    const responseWheather = await fetch(apiWeatherURL);

    if (!responseWheather.ok) {
        throw new Error("erro ao buscar temperatura")  
    }

    const dataWeather = await responseWheather.json(); //pegando a temperatura

 const tableBody = document.querySelector('#api-table tbody'); 

    const row = tableBody.insertRow();
    row.insertCell(0).textContent = dataCep.cep;
    row.insertCell(1).textContent = dataCep.logradouro;
    row.insertCell(2).textContent = dataCep.localidade;
    row.insertCell(3).textContent = parseInt(dataWeather.main.temp);

} catch(error){
    console.error('erro ao carregar: ', error);
    alert("Digite qual é a cidade.")

} 
} 

document.querySelector('#buscar').addEventListener('click', () => {
    const cepInput = document.querySelector('#cep-input');
    const cep = cepInput.value;

receberEPopularDados(cep);
});