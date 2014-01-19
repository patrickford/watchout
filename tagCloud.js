 /****************************
  Strip out punctuation

  Remove common words

  Break string of text into array of words 

  Create hash of unique words with frequency count
*****************************/
var removeCommonWords = function(text) {
  var commonWords = ['a','at','the','and','of','in','be','an','here','these',
    'this','that','from','to','our','on','all','are','under','over',
    'have','has','had','by','each','every','not','nor','us','i','he',
    'she','him','her','can','cannot','is','as','it',
    'so','but','or','for'];

  for(var i = 0; i < commonWords.length; i++) {
    var find = ' ' + commonWords[i] + ' ';
    while(text.indexOf(find) > -1){
      text = text.replace(find, ' ');
    }
  }
  return text;
};


var countWords = function(copy) {
  var cleanCopy = copy.toLowerCase().replace(/[,.!:;]/g, "");
  var keyWords = removeCommonWords(cleanCopy);
  var keywordArray = keyWords.split(" ");

	var wordCounts = {};
	for(var i = 0; i< keywordArray.length; i++) {
    var num = keywordArray[i];
    wordCounts[num] = wordCounts[num] ? wordCounts[num]+1 : 1;
  }
  return wordCounts;
};


