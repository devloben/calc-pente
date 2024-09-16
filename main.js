let regEx = /^[1-9]+/

let depart = document.getElementById('alt-depart')
depart.addEventListener('input', function() {
    validDepart(this)
})

let arrivee = document.getElementById('alt-arrivee')
arrivee.addEventListener('input', function() {
    validArrivee(this)
})

let distance = document.getElementById('distance')
distance.addEventListener('input', function() {
    validDistance(this)
})

const btnCalculPentePourcent = document.getElementById('btn-calcul-pente-pourcent')

let formulaire = document.getElementById('formulaire')
formulaire.addEventListener('input', function() {

    if (validDepart(depart) && validArrivee(arrivee) && validDistance(distance)) {
        btnCalculPentePourcent.classList.add('btn-calcul-pente-ok')
    } else {
        btnCalculPentePourcent.classList.remove('btn-calcul-pente-ok')
    }
})

/* Calcule de la pente en % */
formulaire.addEventListener('input', function(e) {
    e.preventDefault()

    if (validDepart(depart) && validArrivee(arrivee) && validDistance(distance)) {
        const pente = Math.abs(((depart.value - arrivee.value) / distance.value) * 100)
        // const pente = ((depart.value - arrivee.value) / distance.value) * 100
        // const affichagePente = document.querySelector('.affichage-pente')
        // affichagePente.innerText = `Pente à ${pente.toFixed(2)} %`
        btnCalculPentePourcent.value = `Pente à ${pente.toFixed(2)} %`
        return true
    } 
})

let validDepart = function(saisieDepart) {
    let testDepart = regEx.test(saisieDepart.value)
    let msgDepart = document.getElementById('msg-err-depart')

    if (testDepart) {
        // msgDepart.style.display = 'none'
        return true
        } else {
        // msgDepart.style.display = 'block'
        return false
        }
}

let validArrivee = function(saisieArrivee) {
    let testArrivee = regEx.test(saisieArrivee.value)
    let msgArrivee = document.getElementById('msg-err-arrivee')

    if (testArrivee) {
        // msgArrivee.style.display = 'none'
        return true
        } else {
        // msgArrivee.style.display = 'block'
        return false
        }
}

let validDistance = function(saisieDistance) {
    let testDistance = regEx.test(saisieDistance.value)
    let msgDistance = document.getElementById('msg-err-distance')

    if (testDistance) {
        // msgDistance.style.display = 'none'
        return true
        } else {
        // msgDistance.style.display = 'block'
        return false
        }
}

function coordonnees(pos) {
    let crd = pos.coords;
  
    let latitude = crd.latitude;
    let longitude = crd.longitude;
    let altitude = crd.altitude;
    let precisionAltitude = crd.altitudeAccuracy;
    
    document.getElementById('p1').innerHTML= 'Lat : ' + latitude.toFixed(2);
    document.getElementById('p2').innerHTML= 'Lon : ' + longitude.toFixed(2);
    document.getElementById('p3').innerHTML= 'Altitude : ' + altitude.toFixed(2) + ' m';
    document.getElementById('p4').innerHTML= 'Précision : ' + precisionAltitude;
}

navigator.geolocation.getCurrentPosition(coordonnees);