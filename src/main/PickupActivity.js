import React, { useEffect, useState } from 'react';

const PickupActivity = () => {
  const [map1, setMap1] = useState(null);
  const [map2, setMap2] = useState(null);
  const [centerMarker1, setCenterMarker1] = useState(null);
  const [centerMarker2, setCenterMarker2] = useState(null);
  const [autocomplete1, setAutocomplete1] = useState(null);
  const [autocomplete2, setAutocomplete2] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const googleMapScript = document.createElement('script');
          googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAHMbkMzKtcnBhdz4ItcoT36OhjBxkGJQo&libraries=places`;
          window.document.body.appendChild(googleMapScript);

          googleMapScript.addEventListener('load', () => {
            const mapInstance1 = new window.google.maps.Map(document.getElementById('map1'), {
              center: { lat: latitude, lng: longitude },
              zoom: 15
            });
            setMap1(mapInstance1);

            const input1 = document.getElementById('autocomplete1');
            const autocompleteInstance1 = new window.google.maps.places.Autocomplete(input1);
            autocompleteInstance1.bindTo('bounds', mapInstance1);
            setAutocomplete1(autocompleteInstance1);

            autocompleteInstance1.addListener('place_changed', () => {
              const place = autocompleteInstance1.getPlace();
              if (!place.geometry) {
                console.error('No details available for input: ', place.name);
                return;
              }

              mapInstance1.setCenter(place.geometry.location);
              mapInstance1.setZoom(15);
            });

            const MarkerIcon = {
                url: 'https://cdn-icons-png.flaticon.com/512/5527/5527658.png',
                scaledSize: new window.google.maps.Size(50, 50),
              };

            const centerMarkerInstance1 = new window.google.maps.Marker({
              position: mapInstance1.getCenter(),
              map: mapInstance1,
              title: 'Center Marker 1',
              draggable: true,
              icon: MarkerIcon
            });
            setCenterMarker1(centerMarkerInstance1);

            const geocoder1 = new window.google.maps.Geocoder();
            geocoder1.geocode({ location: mapInstance1.getCenter() }, (results, status) => {
              if (status === 'OK' && results[0]) {
                input1.value = results[0].formatted_address;
              } else {
                console.error('Geocoder failed due to: ' + status);
              }
            });

            // Second Map
            const mapInstance2 = new window.google.maps.Map(document.getElementById('map2'), {
              center: { lat: latitude, lng: longitude },
              zoom: 15
            });
            setMap2(mapInstance2);

            const input2 = document.getElementById('autocomplete2');
            const autocompleteInstance2 = new window.google.maps.places.Autocomplete(input2);
            autocompleteInstance2.bindTo('bounds', mapInstance2);
            setAutocomplete2(autocompleteInstance2);

            autocompleteInstance2.addListener('place_changed', () => {
              const place = autocompleteInstance2.getPlace();
              if (!place.geometry) {
                console.error('No details available for input: ', place.name);
                return;
              }

              mapInstance2.setCenter(place.geometry.location);
              mapInstance2.setZoom(15);
            });

            const centerMarkerInstance2 = new window.google.maps.Marker({
              position: mapInstance2.getCenter(),
              map: mapInstance2,
              title: 'Center Marker 2',
              draggable: true,
              icon: MarkerIcon
            });
            setCenterMarker2(centerMarkerInstance2);

            const geocoder2 = new window.google.maps.Geocoder();
            geocoder2.geocode({ location: mapInstance2.getCenter() }, (results, status) => {
              if (status === 'OK' && results[0]) {
                input2.value = results[0].formatted_address;
              } else {
                console.error('Geocoder failed due to: ' + status);
              }
            });
          });

          return () => {
            window.document.body.removeChild(googleMapScript);
          };
        },
        error => {
          console.error('Error getting the current position:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (map1 && centerMarker1) {
      map1.addListener('center_changed', () => {
        centerMarker1.setPosition(map1.getCenter());
        if (autocomplete1) {
          autocomplete1.bindTo('bounds', map1);
          const geocoder1 = new window.google.maps.Geocoder();
          geocoder1.geocode({ location: map1.getCenter() }, (results, status) => {
            if (status === 'OK' && results[0]) {
              document.getElementById('autocomplete1').value = results[0].formatted_address;
            } else {
              console.error('Geocoder failed due to: ' + status);
            }
          });
        }
      });
    }
  }, [map1, centerMarker1, autocomplete1]);

  useEffect(() => {
    if (map2 && centerMarker2) {
      map2.addListener('center_changed', () => {
        centerMarker2.setPosition(map2.getCenter());
        if (autocomplete2) {
          autocomplete2.bindTo('bounds', map2);
          const geocoder2 = new window.google.maps.Geocoder();
          geocoder2.geocode({ location: map2.getCenter() }, (results, status) => {
            if (status === 'OK' && results[0]) {
              document.getElementById('autocomplete2').value = results[0].formatted_address;
            } else {
              console.error('Geocoder failed due to: ' + status);
            }
          });
        }
      });
    }
  }, [map2, centerMarker2, autocomplete2]);

  const handleConfirmPickup = () => {
    const pickupAddress = document.getElementById('autocomplete1').value;
    const dropAddress = document.getElementById('autocomplete2').value;
  
    if (!pickupAddress || !dropAddress) {
      console.error('Please enter both pickup and drop addresses.');
      return;
    }
  
    // Fetch latitude and longitude for pickup address
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(pickupAddress)}&key=AIzaSyAHMbkMzKtcnBhdz4ItcoT36OhjBxkGJQo`)
      .then(response => response.json())
      .then(data => {
        const pickupLocation = data.results[0].geometry.location;
        const oLatitude = pickupLocation.lat;
        const oLongitude = pickupLocation.lng;
  
        // Fetch latitude and longitude for drop address
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(dropAddress)}&key=AIzaSyAHMbkMzKtcnBhdz4ItcoT36OhjBxkGJQo`)
          .then(response => response.json())
          .then(data => {
            const dropLocation = data.results[0].geometry.location;
            const dLatitude = dropLocation.lat;
            const dLongitude = dropLocation.lng;
  
            // Construct Uber URL
            const uberUrl = `https://m.uber.com/go/product-selection?pickup=%7B%22latitude%22%3A${oLatitude}%2C%22longitude%22%3A${oLongitude}%7D&pickup%5B0%5D=%7B%22addressLine1%22%3A%22${encodeURIComponent(pickupAddress)}%22%2C%22addressLine2%22%3A%22%22%2C%22id%22%3A%22%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A${oLatitude}%2C%22longitude%22%3A${oLongitude}%2C%22provider%22%3A%22google_places%22%7D&drop=%7B%22latitude%22%3A${dLatitude}%2C%22longitude%22%3A${dLongitude}%7D&drop%5B0%5D=%7B%22addressLine1%22%3A%22${encodeURIComponent(dropAddress)}%22%2C%22addressLine2%22%3A%22%22%2C%22id%22%3A%22%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A${dLatitude}%2C%22longitude%22%3A${dLongitude}%2C%22provider%22%3A%22google_places%22%7D&vehicle=116`;
  
            // Construct Ola URL
            const olaUrl = `https://book.olacabs.com/?serviceType=p2p&utm_source=widget_on_olacabs&lat=${oLatitude}&lng=${oLongitude}&pickup=&drop_lat=${dLatitude}&drop_lng=${dLongitude}`;
  
            // Open Uber URL in new tab
            window.open(uberUrl, '_blank');
  
            // Open Ola URL in new tab
            window.open(olaUrl, '_blank');
          })
          .catch(error => console.error('Error fetching drop location:', error));
      })
      .catch(error => console.error('Error fetching pickup location:', error));
  };
  

  return (
    <div style={{ display: 'flex', padding: '20px', backgroundColor: 'black'}}>
      <div style={{ flex: '30%', paddingRight: '10px', backgroundColor: 'white', borderRadius: '10px'}}>
        <h2>Edit Pickup and Dropoff</h2>
        <input id="autocomplete1" placeholder="Enter a location" type="text" style={{ width: '100%', marginBottom: '15px', fontSize: '20px'}} />
        <input id="autocomplete2" placeholder="Enter a location" type="text" style={{ width: '100%', marginBottom: '15px', fontSize: '20px'}} />
        <button onClick={handleConfirmPickup} style={{ width: '100%', backgroundColor: 'black', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>Confirm Details</button>
      </div>
  
      <div style={{ flex: '35%', paddingLeft: '20px'}}>
        <div id="map1" style={{ width: '100%', height: '600px', borderRadius: '10px'}}></div>
      </div>
      <div style={{ flex: '35%', paddingLeft: '20px'}}>
        <div id="map2" style={{ width: '100%', height: '600px', borderRadius: '10px' }}></div>
      </div>
    </div>
  );
};

export default PickupActivity;

