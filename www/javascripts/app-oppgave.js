(function() {
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
		
	  self.recordButton.on("click", function(e) {
		// Oppgave 5
        // Her skal du lage en enkel lydopptaker som bruker telefonens standard lydopptaksfunksjon. Du bruker phonegap sitt Capture API for å ta opp lyden. 
		// Lag et Media-objekt av opptaket og spill det av. Du velger selv om du vil lage en ny metode i App for dette, eller om du bare vil legge det direkte på riktig sted i setupBindings().
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
	searchByLocation: function() {
		/*	
			Oppgave 2
			Søke etter tweets i nærheten med geolokasjon. Her må du bruke PhoneGap sitt Geolocation API til å finne lokasjonen din i bredde- og lengdegrad som du legger på som parametre i den oppgitte twitter-url'en.
			Bruk $.ajax() eller $.getJSON() som i oppgave 1 til å gjøre kallet. Du bruker renderTweets() og samme resultatside som i forrige oppgave.
		*/
		
	  	// Legg på lokasjon i denne urlen
	      var twitter_api_url = 'http://search.twitter.com/search.json?geocode=';
	      // Hent tweets basert på lokasjon i json-format
	      $.getJSON(twitter_api_url, function(data) {

	      });
	      // Bytt til resultatsiden og vis tweets
	      $.mobile.changePage(self.resultsPage);
	      self.renderTweets(data.results);
	},
	searchByLocationWithNetworkCheck: function() {
		/*
			Oppgave 4
			Dette er en utvidelse av oppgave 2 hvor man før man henter tweets basert på geolocation, sjekker om telefonen har nettverk. Dette gjøres via PhoneGap sitt Connection-API.
			Hvis man ikke har nettverk, bruk PhoneGap sitt Notification-API til å gi en fornuftig feilmelding. Ellers vis tweets by geolokasjon.
		*/
		console.log("Searching for geolocation with network check")
		var self = this;
		checkConnection();
	    
		function checkConnection() {
			// Bruk PhoneGap til å sjekke om du har tilgang til nettverk
			// Hvis nei, hvis feilmelding, ellers vis tweets by geolocation med metoden findGeoLocationWithPhoneGap()
		}
		
		function alertDismissed() {
			console.log("Alert dismissed");
		}
		
		function findGeoLocationWithPhoneGap() {
			// Denne metoden blir lik som metoden searchByLocation() som du fullførte i oppgave 2
		},
		searchByTwitterName: function(username) {
			/*
			Oppgave 3, første del
			Her skal man kunne søke etter et brukernavn på twitter og så legge til kontaktinfo (bilde og navn i det minste) i kontaktlista på telefonen.
			I denne metoden lager du selve twitter-søket. Metoden renderUser() tar inn objektet du får fra twitter og skriver du ut i html'en.
			I lagreAnsattTilKontaktLista() bruker du phonegap til å lagre brukeren i kontaktlista. Husk å bytt til "vis-bruker"-siden.
			*/
			
			var searchUrl = 'http://api.twitter.com/1/users/show.json?callback=?&screen_name=' + username;

		    // Cache-objekt som tar vare på tidligere søkt på brukernavn
			var screenNameCache = window.screenNameCache || {};
			var userFromCache = screenNameCache[username];
			if (userFromCache){
				// Hvis vi allerede har hentet denne brukeren og lagt i cache, bruk denne istedenfor å kalle på twitter
			} else {
				// Søk etter bruker vha. $.ajax()
			}

		      // Bytt til brukerinfosiden når søkeresultatet kommer
		      $.mobile.changePage(self.usernameResultPage);
		      self.renderUser(data); 
		  	},
			lagreAnsattTilKontaktLista: function(user) {
				// Oppgave 3, andre del
				// Denne delen består av implementere metoden searchByTwitterName() som ligg
		    	// Bruk kontakt-API'et til PhoneGap å lagre informasjonen i "user"-objektet til kontaktlista, f.eks bilde og navn
		    },
    search: function(keyword) {
		/*
		Oppgave 1
		Søk etter keywords på twitter og vis dem i en liste med tweets. Søkefeltet og søkeknappen er allerede knyttet opp til riktige metoder i App-objektet. 
		Du må altså hente ut søkeordet fra søkefeltet og bruke $.ajax() til å hente svar i JSON-format. Dette sender du så til renderTweets(tweets) og bytter til 
		resultatsiden (som også er ett attributt på App).
		*/
     	var searchUrl = 'http://search.twitter.com/search.json?callback=?&q=' + keyword;

	      // Bruk $.ajax() til å søke etter tweets

	      // Bytt til resultatsiden og vis tweets
	      $.mobile.changePage(self.resultsPage);
	      self.renderTweets(data.results);
    }
  });
  window.App = App;
})();