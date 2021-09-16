var width;

// Selectors
var Pupille_g_d = document.getElementById("Pupille_gauche_droite");
var Pupille_g_g = document.getElementById("Pupille_gauche_gauche");
var Pupille_d_d = document.getElementById("Pupille_droite_droite");
var Pupille_d_g = document.getElementById("Pupille_droite_gauche");
var Cheveux = document.getElementById("Ombre_cheveux");
var Sourcil_g = document.getElementById("Sourcil_gauche");
var Sourcil_d = document.getElementById("Sourcil_droit");
var Nez = document.getElementById("Nez");
var Bouche = document.getElementById("Bouche");
var Peau = document.getElementById("Peau");
var Alo = document.getElementById("Alo");

var count = 0;

document.addEventListener("mousemove", function(event) {
  mouse_position(event);
});

function mouse_position(e) {
  var x = e.clientX; //Mouse position detection
  
  width = document.body.clientWidth;

  //If the mouse cursor is at the left side of the window
  if (x <= width / 2.5)
  //Display left look
  {
    Pupille_g_d.style.display = "none";
    Pupille_g_g.style.display = "block";
    Pupille_d_d.style.display = "none";
    Pupille_d_g.style.display = "block";
  }
  else
  //Display right look
  {
    Pupille_g_d.style.display = "block";
    Pupille_g_g.style.display = "none";
    Pupille_d_d.style.display = "block";
    Pupille_d_g.style.display = "none"; 
  }
}


function getRandomColor() {
  var color = 'shirt';
  var number =  Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  console.log(color+number)
  return (color+number).toString();
}

window.onload =  function() {
  document.getElementById("Shirt").classList.toggle(getRandomColor());
}





 
 


