let btn=document.querySelector(".a");

const apikey="3895e1647f2076b1f02a1f9d3002f20c";
const url=`https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

btn.addEventListener("click",async function(){
  let res=await checkbox();
  document.getElementById("result").innerHTML="temperture: "+res.main.temp+"°C";
  document.getElementById("sita").innerHTML="Humidity: "+res.main.humidity+"%";
  document.getElementById("ram").innerHTML="Wind: "+res.wind.speed+"km/hr";
  let temperture=res.main.temp;
  const icon=document.getElementById("icon");
  if(temperture>=20 && temperture<=40){
    icon.src="clear.png";
  } else if(temperture>=15 && temperture<=30){
    icon.src="clouds.png";
  }
  else if(temperture>=10 && temperture<=25){
    icon.src="drizzle.png";
  }else if(temperture>=8 && temperture<=25){
    icon.src="rain.png";
  }else{
    icon.src="snow.png"
  }
})

async function checkbox(){
    let city=document.getElementById("city").value;
    const response=await fetch(`${url}${city}&&appid=${apikey}`)
    const data=await response.json();
    if(data.cod==200){
        return data;
        
    }else{
        document.getElementById("result").innerText="Error found";
    }
}