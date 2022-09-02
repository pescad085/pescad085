async function getBoredAPI() {
    var apiURL = "http://www.boredapi.com/api/activity/";
     var response = await fetch(apiURL);
     //convert data to json
     var data = await response.json();
     // store data in different vars
     
     var {activity, participants } = data;
           document.querySelector(".asideP").innerHTML = activity + ".";
    }
     //call function  
     setInterval(getBoredAPI, 5000);


    
       


