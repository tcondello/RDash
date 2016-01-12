// TODO: review datastructure for integration
// TODO: add the ability to read PDFs
// TODO: add the ability to accept emails and attachments
var gfeed = require('google-feed-api')
var firebase = require('firebase');

var basefURL = new firebase("https://raudhskinna.firebaseio.com/RSS/");
var feedURL = new firebase("https://raudhskinna.firebaseio.com/feedArray")
var localkey = []

function getGoogle(site) {
  var feed = new gfeed.Feed(site)
  feed.setNumEntries(10);
  feed.load(function(r) {
    var siteTitle = r.feed.title;
    sitefURL = basefURL.child(siteTitle.replace(/ |\./g, "_"))
    for (var i = 0; i < r.feed.entries.length; i++) {
      var entry = r.feed.entries[i];
      storeData(entry)
    }
  })
}
function storeData(data) {
  var articleTitle = data.title;
  var articleKey = articleTitle.replace(/ |\./g, "_")
  articleKey = articleKey.replace(/\r?\n|\r/g,"")
  articleKey = articleKey.replace(/\$|\#|\[|\]/g, "")
  if (localkey.indexOf(articleKey) >= 0){
    return
  }
  localkey.push(articleKey)
  var articleURL = data.link;
  var contentSnippet = data.contentSnippet;
  var fullContent = data.content;
  articlefURL = sitefURL.child(articleKey)
  //console.log(articleKey);
  articlefURL.set({
    title: articleTitle,
    link: articleURL,
    contentSnippet: contentSnippet,
    content: fullContent,
    read: false
  })
}
setInterval(function () {
  feedURL.once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      //console.log(childSnapshot.val());
      getGoogle(childSnapshot.val());
    });
  });
}, 600000)//10minutes
