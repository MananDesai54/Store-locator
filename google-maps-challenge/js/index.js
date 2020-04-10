var markers = [];
var map;
var infoWindow;
var storeBox;
var zipcode;
//storeBox = document.querySelectorAll('.store-detail')
    // storeBox.forEach((store,index)=>{
    //     store.addEventListener('click',()=>{
    //       new google.maps.event.trigger(markers[index],'click')
    //     })
    //   })
window.onload = ()=> {
    // displayStores();
    storeBox = document.querySelectorAll('.store-detail')
    storeBox.forEach(store=>{
        store.addEventListener('click',(event)=>{
            //console.log(event.target.dataset)
            let clickedStore = stores.find(s=>{
                return s.name == event.target.dataset.name;
            })
            // showClicked(clickedStore,event.target.dataset.num);
        })
    })
}
function initMap() {
    var losAngeles = {
        lat: 34.063380, 
        lng: -118.358080
    };
    infoWindow = new google.maps.InfoWindow();;
        map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
        ],
        //mapTypeId: 'terrain',
        mapTypeId: 'roadmap'
        //mapTypeId: 'hybrid'
        //mapTypeId: 'satellite'
    })

    //showMarker();
    //createMarker();
    searchStores();
}

function displayStores(foundStores) {
    var storeHtml = '';

    foundStores.forEach((store,index)=>{
        storeHtml += `
            <div class="store-detail" data-name="${store.name}" data-num="${index+1}">
            <div class="detail">
                <p>${store.addressLines[0]}</p>
                <p>${store.addressLines[1]}</p>
                <p>${store.phoneNumber}</p>
            </div>
            <div class="circle">${index+1}</div>
            </div>
            <hr>
        `
        document.querySelector('.store-list').innerHTML = storeHtml;
    })
}

function searchStores() {
    let foundStores = [];
    zipcode = document.querySelector('input').value;
    if(zipcode.trim()) {
        stores.forEach(store=>{
          let postal = store.address.postalCode.substring(0,5);
          if(postal===zipcode) {
            foundStores.push(store);
          }
        })
    }else {
      foundStores = stores;
    }
    clearLocaton();
    displayStores(foundStores);
    createMarker(foundStores);
    storeBox = document.querySelectorAll('.store-detail')
    storeBox.forEach((store,index)=>{
        store.addEventListener('click',()=>{
          new google.maps.event.trigger(markers[index],'click')
        })
      })
}

function clearLocaton() {
  infoWindow.close();
  markers.forEach(m=>{
    m.setMap(null);
  })
  markers.length = 0;
}

// function showMarker() {
        
//     stores.forEach(store=>{
//         var starbuck = {
//             lat: store.coordinates.latitude, 
//             lng: store.coordinates.longitude
//         }
//         var marker = new google.maps.Marker({
//             position: starbuck,
//             title:store.name
//         })
//         marker.setMap(map);
//     })
// }

//or naz/google developers way , btw mine is shorter...

function createMarker(foundStores) {
    var bounds = new google.maps.LatLngBounds();
    for(var [index,store] of foundStores.entries()) {
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude
        );
        var name = store.name;
        var address = store.addressLines[0];
        var open = store.openStatusText;
        var phone = store.phoneNumber;
        showMarker(latlng,name,address,index,open,phone);
        bounds.extend(latlng);
    }
    map.fitBounds(bounds);
}

function showClicked(store,num) {
    var latlng = new google.maps.LatLng(
        store.coordinates.latitude,
        store.coordinates.longitude
    );
    var name = store.name;
    var address = store.addressLines[0];
    var open = store.openStatusText;
    var phone = store.phoneNumber;
    showDetail(latlng,name,address,open,phone,num);
}

function showDetail(latlng,name,address,open,phone,index) {
    console.log(index);
    var html = `
        <div class="infowindow">
        <h1 class="store-title">${name}</h1>
        <p class="open">${open}</p>
        <p class="address"><i class="fas fa-location-arrow"></i><a href="https://www.google.com/maps/dir/Kamrej+-+Kadodara+Rd,+Vav,+Gujarat,+India/${address}" target="blank">${address}</a></p>
        <p class="contact"><i class="fas fa-phone-alt"></i>
        <span>${phone}</span></p>
        </div>
    `
    let mark = markers.find(m=>{
        return m.label === index;
    })
    console.log(mark);
    infoWindow.setContent(html);
    infoWindow.open(map, mark);
   
}

function showMarker(latlng,name,address,index,open,phone) {
    //var html = "<b>" + name + "</b> <br/>" + address;
    var icons = {
      buycks : 'starbucks.png'
    };
    var html = `
        <div class="infowindow">
        <h1 class="store-title">${name}</h1>
        <p class="open">${open}</p>
        <p class="address"><i class="fas fa-location-arrow"></i><a href="https://www.google.com/maps/dir/Las+Vegas,+Nevada,+USA/${address}" target="blank">${address}</a></p>
        <p class="contact"><i class="fas fa-phone-alt"></i>
        <span>${phone}</span></p>
        </div>
    `
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: String(index+1),
        icon : './6.png'
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}
