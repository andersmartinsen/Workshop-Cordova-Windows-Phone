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
    this.setupBindings();
  }
  $.extend(App.prototype, {
    setupBindings: function(){
      var self = this;
      console.log(self.searchButton);
      self.searchButton.on("click", function(e){
        e.preventDefault();
        self.search(self.searchField.val());
      });

      self.geoSearchButton.on("click", function(e) {
        e.preventDefault();
        self.searchByLocation();
      });

  	  self.twitterUserSearchButton.on("click", function(e) {
  	        e.preventDefault();
  	        self.searchByTwitterName(self.searchUsernameField.val());
       });

      self.recordButton.on("click", function(e){
        // Ta opp et lydklipp og spill det av
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
      // Bruk kontakt-API'et til å lagre informasjonen i "user"-objektet til kontaktlista, f.eks bilde og navn  
    },
    searchByLocation: function(){
      // Legg på lokasjon i denne urlen
      var twitter_api_url = 'http://search.twitter.com/search.json?geocode=';
      // Hent tweets basert på lokasjon i json-format
      $.getJSON(twitter_api_url, function(data) {
        
      });
      // Bytt til resultatsiden og vis tweets
      $.mobile.changePage(self.resultsPage);
      self.renderTweets(data.results);
    },
  	searchByTwitterName: function(username) {
      var searchUrl = 'http://api.twitter.com/1/users/show.json?callback=?&screen_name=' + username;

      // Søk etter bruker vha. $.ajax()

      // Bytt til brukerinfosiden når søkeresultatet kommer
      $.mobile.changePage(self.usernameResultPage);
      self.renderUser(data); 
  	},
    search: function(keyword){
      var searchUrl = 'http://search.twitter.com/search.json?callback=?&q=' + keyword;

      // Bruk $.ajax() til å søke etter tweets

      // Bytt til resultatsiden og vis tweets
      $.mobile.changePage(self.resultsPage);
      self.renderTweets(data.results); 
      
    }
  });
  window.App = App;
})();