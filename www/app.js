(function(){
  function App(params){
    this.searchField = $(params.searchField);
    this.tweets = $(params.tweets);
    this.searchButton = $(params.searchButton);
    this.twitterUserSearchButton = $(params.twitterUserSearchButton);
    this.searchUsernameField = $(params.searchUsernameField);
    this.usernameResultPage = $(params.usernameResultPage);
    this.user = $(params.user);
    this.geoSearchButton = $(params.geoSearchButton);
    this.resultsPage = $(params.resultsPage);
    this.recordButton = $(params.recordButton);
	this.geoNetworkSearchButton = $(params.geoNetworkSearchButton); 
    this.setupBindings();
  }
  $.extend(App.prototype, {
    setupBindings: function(){
      console.log("Setting up bindings");
      var self = this;
      console.log(self.searchButton);
      self.searchButton.on("click", function(e){
        console.log("Search button clicked");
        e.preventDefault();
        self.search(self.searchField.val());
      });

      self.geoSearchButton.on("click", function(e) {
        e.preventDefault();
        self.searchByLocation();
      });

	  self.geoNetworkSearchButton.on("click", function(e) {
        e.preventDefault();
        self.searchByLocationWithNetworkCheck();
      });

	  self.twitterUserSearchButton.on("click", function(e) {
	        e.preventDefault();
	        self.searchByTwitterName(self.searchUsernameField.val());
      });
		
	  self.recordButton.on("click", function(e){
        navigator.device.capture.captureAudio(function(mediaFiles){
          mediaFiles.forEach(function(mediaFile){
            var path = mediaFile.fullPath;
            new Media(path).play();
          });
        }, function(){}, {limit: 1});
      });
    },
	renderTweets: function(tweets){
	      var self = this;
	      $.each(tweets, function(i, tweet) {
	        if(tweet.text !== undefined) {
	          var tweet_html = '<li><h1>Tweet</h1><p>' + tweet.text + '</p><\/li>';
	          self.tweets.append(tweet_html);
	        }
	      });
	      self.tweets.listview("refresh");
	},
	renderUser: function(user){
		var self = this;
		var user_html = '<img src="' + user.profile_image_url_https + '"/>'
		user_html += '<p>Navn: ' + user.name + '</p>';
		user_html += '<p>Følgere: ' + user.followers_count + '</p>'
		user_html += '<p>Følger: ' + user.friends_count + '</p>'
		user_html += '<a href="" class="save" onClick="lagreAnsattTilKontaktLista(); return false;" class="ui-btn-right" data-role="button" data-icon="check">Save</a>';
		self.user.append(user_html);
    self.user.find("a.save").on("click", function(){
      self.lagreAnsattTilKontaktLista(user);
    });
  },
	lagreAnsattTilKontaktLista: function(user) {
    var contact = navigator.contacts.create();
    contact.displayName = user.name;

    var bilder = [1];
    bilder[0] = new ContactField('url', user.profile_image_url_https, true);
    contact.photos = bilder;

    var name = new ContactName();
    var names = user.name.split(" ");
    name.givenName = names[0];
    if (names.length > 1){
      name.familyName = names[1];
    }
    contact.name = name;

    contact.save(onSuccess, onError);

    function onSuccess() {
        navigator.notification.alert('Kontakten ble lagret i adresseboka', null, 'Suksess');
    }

    function onError(contactError) {
        navigator.notification.alert('Feilkode: ' + contactError.code, null, 'En feil inntraff');
    }
    },
    searchByLocation: function(){
	  console.log("Searching for geolocation");
      var self = this;
	  navigator.geolocation.getCurrentPosition(function(location){
        var twitter_api_url = 'http://search.twitter.com/search.json?geocode=';
        var latitude = location.coords.latitude;
        var longitude = location.coords.longitude;
        twitter_api_url += latitude + ',' + longitude + ',10km&rpp=5&show_user=true';

        $.getJSON(twitter_api_url, function(data) {
          if (data == undefined || data.results == undefined || data.results.length == 0){
            navigator.notification.alert("No results for your location");
          } else {
            $.mobile.changePage(self.resultsPage);
            self.renderTweets(data.results);
          }
        });
      } , function(error){console.log("Something went wrong with location")});
	},
	searchByLocationWithNetworkCheck: function() {
		console.log("Searching for geolocation with network check")
		var self = this;
		checkConnection();
	    
		function checkConnection() {
		  	var networkState = navigator.network.connection.type;
		
			if (networkState == Connection.UNKNOWN || networkState == Connection.NONE) {
				console.log("No network. Returns an error alert");
				navigator.notification.alert(
				            'Could not fetch tweets since you are not connected to a network',
				            alertDismissed,
				            'Network problems',            
				            'Done'
						);
			} else {
				findGeoLocationWithPhoneGap();
			}
		}
		
		function alertDismissed() {
		        // do something
		}
		
		function findGeoLocationWithPhoneGap() {
			console.log("Henter geolocation with PhoneGap")
		    navigator.geolocation.getCurrentPosition(function(location)
			{
	        	var twitter_api_url = 'http://search.twitter.com/search.json?geocode=';
	        	var latitude = location.coords.latitude;
	        	var longitude = location.coords.longitude;
	        	twitter_api_url += latitude + ',' + longitude + ',10km&rpp=5&show_user=true';

	        	$.getJSON(twitter_api_url, function(data) {
	          		if (data == undefined || data.results == undefined || data.results.length == 0){
	            		navigator.notification.alert("No results for your location");
	          		} else {
	            		$.mobile.changePage(self.resultsPage);
	            		self.renderTweets(data.results);
	          		}
	        	});
	      		} , function(error){console.log("Something went wrong when fetching tweets by geolocation")});
	 		}
		},
		searchByTwitterName: function(username) {
		console.log("Searching for " + username);
	      var searchUrl = 'http://api.twitter.com/1/users/show.json?callback=?&screen_name=' + username;
	      var self = this;
	      $.ajax({
	        url: searchUrl,
	        dataType: "JSON",
	        type: "GET",
	        success: function(data) {
	          $.mobile.changePage(self.usernameResultPage);
	          self.renderUser(data); 
	        },
	        error: function(xhr, textStatus, errorThrown){
	          console.log(xhr);
	          console.log(textStatus);
	          console.log(errorThrown);
	          alert("Noe gikk galt når vi søkte etter bruker på twitter :(");
	        }
	      });
	},
    search: function(keyword){
      console.log("Searching for " + keyword);
      var searchUrl = 'http://search.twitter.com/search.json?callback=?&q=' + keyword;
      var self = this;
      $.ajax({
        url: searchUrl,
        dataType: "JSON",
        type: "GET",
        success: function(data) {
          $.mobile.changePage(self.resultsPage);
          self.renderTweets(data.results); 
        },
        error: function(xhr, textStatus, errorThrown){
          console.log(xhr);
          console.log(textStatus);
          console.log(errorThrown);
          alert("Noe gikk galt når vi hentet tweets :(");
        }
      });
    }
  });
  window.App = App;
})();