/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */

function dropDownMenu() {
  document.getElementById("myDropdown").classList.toggle("show");
  dropBtnValue();
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches("#dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
        document.getElementById("dropbtn").innerText = "▼"
      }
    }
  }
};

const dropBtnValue = ( ) =>{
    if(document.getElementById("dropbtn").innerText === "▼"){
        document.getElementById("dropbtn").innerText = "X";
      }else {
        document.getElementById("dropbtn").innerText = "▼";
      }
}


